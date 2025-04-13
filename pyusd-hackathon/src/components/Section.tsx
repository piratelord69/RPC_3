import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, title, className }) => (
  <section className={cn('mb-8 md:mb-12 lg:mb-16', className)}>
    {title && (
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default Section;
