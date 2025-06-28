import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.4 }
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={`bg-gray-800/50 backdrop-blur-xl border border-gray-700/60 rounded-xl p-6 shadow-sm hover:shadow-purple-500/20 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};

<<<<<<< Updated upstream
export default GlassCard; 
=======
export default GlassCard;
>>>>>>> Stashed changes
