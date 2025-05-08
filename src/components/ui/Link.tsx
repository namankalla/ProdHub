import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = '' }) => {
  return (
    <a 
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        // In a real app, we would use a router here
        console.log(`Navigating to: ${href}`);
      }}
    >
      {children}
    </a>
  );
};