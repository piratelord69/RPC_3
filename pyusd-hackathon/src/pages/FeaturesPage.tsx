// File: src/pages/FeaturesPage.tsx
import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSanctionTrace } from '@/hooks/useSanctionTrace';
import { useSanctionCheck } from '@/hooks/useSanctionCheck';

const FeaturesPage: React.FC = () => {
  const [wallet, setWallet] = useState("");
  const [depth, setDepth] = useState(3);
  const { loading, traceData, error, runTrace } = useSanctionTrace();
  const { result, loading: checkLoading, error: checkError, checkWallet } = useSanctionCheck();

  return (
    <PageWrapper title="Features" description="Explore the key features of our solution.">
      <Section>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Our PYUSD solution is packed with powerful features designed to enhance
          your experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Advanced Security</CardTitle>
              <CardDescription>
                Protecting your assets with cutting-edge security measures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Multi-factor authentication</li>
                <li>End-to-end encryption</li>
                <li>Regular security audits</li>
                <li>Real-time monitoring</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Scalability</CardTitle>
              <CardDescription>
                Designed to handle massive growth and high transaction volumes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Horizontal scaling</li>
                <li>Load balancing</li>
                <li>Optimized database performance</li>
                <li>Efficient resource management</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Integration</CardTitle>
              <CardDescription>
                Seamlessly integrate with other platforms and services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>API access</li>
                <li>Webhooks</li>
                <li>SDKs for multiple languages</li>
                <li>Support for industry standards</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Sanctioned Wallet Checker">
  <div className="space-y-4">
    <Input
      placeholder="Enter Ethereum wallet address"
      value={wallet}
      onChange={(e) => setWallet(e.target.value)}
    />
<div className="space-y-3">
  <div className="flex items-center gap-3">
    <label className="text-sm text-gray-700 dark:text-gray-300">
      <input
        type="checkbox"
        className="mr-2"
        checked={depth > 0}
        onChange={(e) => setDepth(e.target.checked ? 1 : 0)}
      />
      Enable Interaction Trace
    </label>

    <select
      className="border rounded-md px-2 py-1 text-sm"
      value={depth}
      onChange={(e) => setDepth(parseInt(e.target.value))}
      disabled={depth === 0}
    >
      {[1, 2, 3, 4].map((d) => (
        <option key={d} value={d}>{`${d} hop${d > 1 ? "s" : ""}`}</option>
      ))}
    </select>
  </div>
</div>

    <Button disabled={!wallet || checkLoading} onClick={() => checkWallet(wallet, depth > 0)}>
      {checkLoading ? "Checking..." : "Check Wallet"}
    </Button>
    {checkError && <p className="text-red-500">{checkError}</p>}
    {result && (
      <div className="border p-4 rounded-md space-y-1 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>Name Tag:</strong> {result.name}</p>
        <p>
          <strong>Sanctioned:</strong>{" "}
          <span className={result.sanctioned ? "text-red-600" : "text-green-600"}>
            {result.sanctioned ? "Yes" : "No"}
          </span>
        </p>
        {depth > 0 && (
          <p>
            <strong>Interacted with blocked wallet:</strong>{" "}
            <span className={result.interacted ? "text-red-600" : "text-green-600"}>
              {result.interacted ? `Yes (${result.interactedWith})` : "No"}
            </span>
          </p>
        )}
      </div>
    )}
  </div>
</Section>

    </PageWrapper>
  );
};

export default FeaturesPage;
