import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className }: CardProps) => (
  <div className={`card-content ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }: CardProps) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className }: CardProps) => (
  <h2 className={`card-title ${className}`}>{children}</h2>
);
