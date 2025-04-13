// File: src/pages/DocumentationPage.tsx
import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DocumentationPage: React.FC = () => (
  <PageWrapper title="Documentation" description="Explore our comprehensive documentation.">
    <Section>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Welcome to our documentation. Here, you will find detailed information on
        how to use our PYUSD Hackathon solution.
      </p>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Getting Started
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Installation Guide</li>
        <li>Configuration Options</li>
        <li>API Reference</li>
        <li>Tutorials and Examples</li>
      </ul>
    </Section>
    <Section title="API Endpoints">
      <Card>
        <CardHeader>
          <CardTitle>Endpoint: /api/data</CardTitle>
          <CardDescription>Retrieves data from the server.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto text-sm">
            <code>
              <span className="text-green-500">GET</span>{' '}
              <span className="text-blue-500">/api/data</span>
              {'\n'}
              <span className="text-gray-500">// Response:</span>{'\n'}
              <span className="text-yellow-500">{'{'}</span>{'\n'}
              &nbsp;&nbsp;<span className="text-cyan-500">data</span>: [{'{'}
              <span className="text-purple-500">id</span>: <span className="text-orange-500">1</span>,{' '}
              <span className="text-purple-500">name</span>: <span className="text-red-500">"Example Data"</span>{'}'}],{'\n'}
              <span className="text-yellow-500">{'}'}</span>
            </code>
          </pre>
        </CardContent>
      </Card>
    </Section>
  </PageWrapper>
);

export default DocumentationPage;