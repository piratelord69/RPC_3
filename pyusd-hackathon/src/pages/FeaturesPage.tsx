// File: src/pages/FeaturesPage.tsx
import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturesPage: React.FC = () => (
  <PageWrapper title="Features" description="Explore the key features of our solution.">
    <Section>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Our PYUSD solution is packed with powerful features designed to enhance
        your experience.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Security</CardTitle>
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
            <CardTitle>Scalability</CardTitle>
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
            <CardTitle>Integration</CardTitle>
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
  </PageWrapper>
);

export default FeaturesPage;
