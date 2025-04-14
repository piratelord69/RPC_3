import { useState } from "react";
import { getAccessToken, getActiveCredentials, rotateCredentials } from "@/lib/BigQueryAuth";

type Result = {
  isFront: boolean;
  isMixer: boolean;
  frontScore: number;
  mixerScore: number;
};

export function useMixerFrontCheck() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWallet = async (wallet: string, useHops: boolean, hops: number) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const token = await getAccessToken();
      const address = wallet.trim().toLowerCase();

      const query = `
        SELECT to_address, value, block_timestamp
        FROM \`bigquery-public-data.crypto_ethereum.transactions\`
        WHERE from_address = LOWER("${address}")
        ORDER BY block_timestamp ASC
        LIMIT 500
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
      const rows = data.rows || [];

      let totalTx = rows.length;
      let txTimes = rows.map((r: any) => new Date(r.f[2].v).getTime());
      let values = rows.map((r: any) => parseFloat(r.f[1].v));
      let toAddresses = rows.map((r: any) => r.f[0].v.toLowerCase());

      // MIXER CHECK: Time difference between transactions
      const timeDiffs = txTimes.slice(1).map((t, i) => t - txTimes[i]);
      const avgTime = timeDiffs.reduce((a, b) => a + b, 0) / (timeDiffs.length || 1);
      const isMixer = avgTime < 60000; // avg < 60 sec
      const mixerScore = Math.min(1, 60000 / avgTime);

      // FRONT CHECK: value concentration in top targets
      const valueByAddress: Record<string, number> = {};
      toAddresses.forEach((addr, i) => {
        valueByAddress[addr] = (valueByAddress[addr] || 0) + values[i];
      });

      const totalValue = values.reduce((a, b) => a + b, 0);
      const sortedTargets = Object.entries(valueByAddress).sort((a, b) => b[1] - a[1]);
      const top3Value = sortedTargets.slice(0, 3).reduce((sum, [, val]) => sum + val, 0);
      const isFront = top3Value / totalValue > 0.7;
      const frontScore = top3Value / totalValue;

      setResult({ isFront, isMixer, frontScore, mixerScore });
    } catch (e) {
      console.error(e);
      rotateCredentials();
      setError("Analysis failed or quota exceeded.");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, analyzeWallet };
}
