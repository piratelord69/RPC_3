import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, title, description, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={cn('container mx-auto px-4 py-8 md:py-12 lg:py-16', className)}
  >
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
      {title}
    </h1>
    {description && (
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8 md:mb-10 max-w-2xl mx-auto">
        {description}
      </p>
    )}
    {children}
  </motion.div>
);

export default PageWrapper;
