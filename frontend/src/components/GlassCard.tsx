import React, { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <div className={`backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
