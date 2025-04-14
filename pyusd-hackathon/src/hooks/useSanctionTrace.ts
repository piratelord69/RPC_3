// src/hooks/useSanctionTrace.ts
import { useState } from "react";
import { getAccessToken, getActiveCredentials, rotateCredentials } from "@/lib/BigQueryAuth";
import csvText from "@/assets/blocked_address.csv?raw";

type TraceLink = { source: string; target: string; isBlocked: boolean };

export function useSanctionTrace() {
  const [traceData, setTraceData] = useState<TraceLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockedSet = new Set(
    csvText
      .split("\n")
      .slice(1)
      .map((line) => line.split(",")[0].trim().toLowerCase())
  );

  const queryInteractions = async (from: string): Promise<string[]> => {
    const token = await getAccessToken();
    const query = `
      SELECT DISTINCT to_address
      FROM \`bigquery-public-data.crypto_ethereum.transactions\`
      WHERE from_address = LOWER("${from}")
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
    return (data.rows || []).map((r: any) => r.f[0].v.toLowerCase());
  };

  const runTrace = async (start: string, maxDepth: number) => {
    setLoading(true);
    setTraceData([]);
    setError(null);

    try {
      const visited = new Set<string>();
      const links: TraceLink[] = [];

      const recurse = async (addr: string, depth: number) => {
        if (depth > maxDepth || visited.has(addr)) return;
        visited.add(addr);

        const neighbors = await queryInteractions(addr);
        for (const target of neighbors) {
          links.push({
            source: addr,
            target,
            isBlocked: blockedSet.has(target),
          });
          await recurse(target, depth + 1);
        }
      };

      await recurse(start.trim().toLowerCase(), 1);
      setTraceData(links);
    } catch (e) {
      console.error(e);
      rotateCredentials();
      setError("Trace failed or quota exceeded.");
    } finally {
      setLoading(false);
    }
  };

  return { traceData, loading, error, runTrace };
}
