// File: src/pages/HomePage.tsx
import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => (
  <PageWrapper title="Welcome to Our PYUSD Solution" description="A cutting-edge solution for the PYUSD Hackathon.">
    <Section title="Key Features">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Innovative Technology</CardTitle>
            <CardDescription>
              Leveraging the power of PYUSD for groundbreaking solutions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Our platform utilizes state-of-the-art technology to provide seamless and
              efficient solutions for the PYUSD ecosystem.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Secure and Reliable</CardTitle>
            <CardDescription>
              Ensuring the highest standards of security and reliability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              We prioritize the security of your assets and data with robust
              infrastructure and best practices.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">User-Friendly Interface</CardTitle>
            <CardDescription>
              Designed for a smooth and intuitive user experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Our platform is built with the user in mind, making it easy to navigate
              and use for everyone.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
    <Section title="Get Started">
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Ready to dive in? Explore our documentation or contact us for more
        information.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button variant="default" size="lg" className="text-white dark:text-white">
          Learn More
        </Button>
        <Button variant="outline" size="lg" className="text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
          Contact Us
        </Button>
      </div>
    </Section>
  </PageWrapper>
);

export default HomePage;