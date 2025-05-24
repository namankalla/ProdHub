import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface StatsCardProps {
  label: string;
  count: number;
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  count, 
  icon,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center p-4 rounded-lg bg-gray-700/40 border border-gray-700 hover:border-purple-500 transition-all group ${className}`}
    >
      {icon && (
        <div className="mb-2 transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
        <CountUp end={count} duration={1.5} />
      </div>
      <div className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
        {label}
      </div>
    </motion.div>
  );
};

export default StatsCard; 