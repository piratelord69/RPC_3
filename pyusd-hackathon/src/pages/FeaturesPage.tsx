import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSanctionTrace } from '@/hooks/useSanctionTrace';
import { useSanctionCheck } from '@/hooks/useSanctionCheck';
import { useMixerFrontCheck } from '@/hooks/useMixerFrontCheck';

const FeaturesPage: React.FC = () => {
  // Sanctioned wallet checker states
  const [wallet, setWallet] = useState("");
  const [depth, setDepth] = useState(1);
  const [enableHops, setEnableHops] = useState(true);

  const { loading, traceData, error, runTrace } = useSanctionTrace();
  const { result, loading: checkLoading, error: checkError, checkWallet } = useSanctionCheck();

  // Mixer/front wallet checker states
  const [walletMF, setWalletMF] = useState("");
  const [depthMF, setDepthMF] = useState(1);
  const [enableHopsMF, setEnableHopsMF] = useState(true);
  const { result: resultMF, loading: loadingMF, error: errorMF, analyzeWallet } = useMixerFrontCheck();

  return (
    <PageWrapper title="Features" description="Explore the key features of our solution.">
      <Section>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Our PYUSD solution is packed with powerful features designed to enhance your experience.
        </p>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Advanced Security</CardTitle>
              <CardDescription>Protecting your assets with cutting-edge security measures.</CardDescription>
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
              <CardDescription>Designed to handle massive growth and high transaction volumes.</CardDescription>
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
              <CardDescription>Seamlessly integrate with other platforms and services.</CardDescription>
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

      {/* Sanctioned Wallet Checker */}
      <Section title="Sanctioned Wallet Checker">
        <div className="space-y-4">
          <Input
            placeholder="Enter Ethereum wallet address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                className="mr-2"
                checked={enableHops}
                onChange={(e) => setEnableHops(e.target.checked)}
              />
              Enable Multi-hop Analysis?
            </label>
            {enableHops && (
              <select
                className="border rounded px-2 py-1 text-sm"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4].map((d) => (
                  <option key={d} value={d}>{d} hop{d > 1 && "s"}</option>
                ))}
              </select>
            )}
          </div>
          <Button disabled={!wallet || checkLoading} onClick={() => checkWallet(wallet, enableHops ? depth : 0)}>
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
              {enableHops && (
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

      {/* Mixer & Front Wallet Checker */}
      <Section title="Mixer & Front Wallet Checker">
        <div className="space-y-4">
          <Input
            placeholder="Enter Ethereum wallet address"
            value={walletMF}
            onChange={(e) => setWalletMF(e.target.value)}
          />
          <div className="flex gap-3 items-center">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                className="mr-2"
                checked={enableHopsMF}
                onChange={(e) => setEnableHopsMF(e.target.checked)}
              />
              Enable Multi-hop Analysis?
            </label>
            {enableHopsMF && (
              <select
                className="border rounded px-2 py-1 text-sm"
                value={depthMF}
                onChange={(e) => setDepthMF(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4].map((d) => (
                  <option key={d} value={d}>{d} hop{d > 1 && "s"}</option>
                ))}
              </select>
            )}
          </div>
          <Button disabled={!walletMF || loadingMF} onClick={() => analyzeWallet(walletMF, enableHopsMF, depthMF)}>
            {loadingMF ? "Analyzing..." : "Run Mixer/Front Check"}
          </Button>
          {errorMF && <p className="text-red-500">{errorMF}</p>}
          {resultMF && (
            <div className="border p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <strong>Is Mixer:</strong>{" "}
                <span className={resultMF.isMixer ? "text-red-600" : "text-green-600"}>
                  {resultMF.isMixer ? `Yes (Score: ${resultMF.mixerScore.toFixed(2)})` : "No"}
                </span>
              </p>
              <p>
                <strong>Is Front:</strong>{" "}
                <span className={resultMF.isFront ? "text-red-600" : "text-green-600"}>
                  {resultMF.isFront ? `Yes (Score: ${resultMF.frontScore.toFixed(2)})` : "No"}
                </span>
              </p>
            </div>
          )}
        </div>
      </Section>
    </PageWrapper>
  );
};

export default FeaturesPage;
