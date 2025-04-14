// src/hooks/useSanctionCheck.ts
import { useEffect, useState } from "react";
import csvText from "@/assets/blocked_address.csv?raw";
import { getAccessToken, rotateCredentials, getActiveCredentials } from "@/lib/BigQueryAuth";

const parsedSanctions = csvText
  .split("\n")
  .slice(1)
  .map((line) => {
    const [address, name] = line.split(",");
    if (!address || !name) return null;
    return {
      address: address.trim().toLowerCase(),
      name: name.trim(),
    };
  })
  .filter((entry): entry is { address: string; name: string } => entry !== null);

const blockedSet = new Set(parsedSanctions.map((entry) => entry.address));

export function useSanctionCheck() {
  const [result, setResult] = useState<{
    name: string;
    sanctioned: boolean;
    interacted: boolean;
    interactedWith?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkWallet = async (wallet: string, trace: boolean) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const addr = wallet.trim().toLowerCase();
      const direct = parsedSanctions.find((s) => s.address === addr);

      if (direct) {
        setResult({
          name: direct.name,
          sanctioned: true,
          interacted: false,
        });
        setLoading(false);
        return;
      }

      if (!trace) {
        setResult({
          name: "Not Found",
          sanctioned: false,
          interacted: false,
        });
        setLoading(false);
        return;
      }

      // Perform 1-hop interaction check
      const token = await getAccessToken();
      const query = `
        SELECT DISTINCT to_address
        FROM \`bigquery-public-data.crypto_ethereum.transactions\`
        WHERE from_address = LOWER("${addr}")
        LIMIT 100
      `;

      const res = await fetch(
        `https://bigquery.googleapis.com/bigquery/v2/projects/${getActiveCredentials().project_id}/queries`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, useLegacySql: false }),
        }
      );

      const data = await res.json();
      const rows: string[] = (data?.rows || []).map((r: any) => r.f[0].v.toLowerCase());
      const match = rows.find((to) => blockedSet.has(to));

      if (match) {
        const matched = parsedSanctions.find((s) => s.address === match);
        setResult({
          name: "Not Found",
          sanctioned: false,
          interacted: true,
          interactedWith: matched?.name || match,
        });
      } else {
        setResult({
          name: "Not Found",
          sanctioned: false,
          interacted: false,
        });
      }
    } catch (err) {
      console.error(err);
      rotateCredentials();
      setError("Query failed. Switched RPC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, checkWallet };
}
