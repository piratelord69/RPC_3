// File: src/pages/ContactPage.tsx
import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import Section from '@/components/Section';
import { ContactForm } from '@/components/ContactForm';

const ContactPage: React.FC = () => (
  <PageWrapper title="Contact Us" description="Get in touch with us for any inquiries.">
    <Section>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We would love to hear from you! Please fill out the form below or reach
        out to us via email or phone.
      </p>
      <ContactForm />
    </Section>
  </PageWrapper>
);

export default ContactPage;
