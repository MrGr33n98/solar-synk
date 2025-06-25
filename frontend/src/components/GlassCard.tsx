import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 ${className}`}
    >
      {children}
    </motion.div>
  );
};
