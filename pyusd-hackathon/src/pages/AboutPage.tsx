// File: src/pages/AboutPage.tsx
import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage: React.FC = () => (
  <PageWrapper title="About Us" description="Learn more about our team and mission.">
    <Section>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We are a passionate team dedicated to developing innovative solutions for
        the PYUSD ecosystem. Our mission is to create a more accessible and
        efficient financial future.
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        Our team comprises experts in blockchain technology, finance, and user
        experience. We are committed to delivering high-quality, secure, and
        user-friendly products.
      </p>
    </Section>
    <Section title="Our Team">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Co-Founder & CEO</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              John is a seasoned entrepreneur with a passion for blockchain
              technology.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jane Smith</CardTitle>
            <CardDescription>Lead Developer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Jane is a skilled developer with extensive experience in building
              decentralized applications.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alex Johnson</CardTitle>
            <CardDescription>Head of Design</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Alex is a creative designer focused on delivering intuitive and
              engaging user experiences.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  </PageWrapper>
);

export default AboutPage;