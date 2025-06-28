import React from 'react';
import { Music, Home } from 'lucide-react';
import { Link } from '../components/ui/Link';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Music className="h-24 w-24 text-purple-500" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">404 - Beat Not Found</h1>
        <p className="text-xl text-gray-400 mb-8">
          The track you're looking for seems to have slipped out of the mix.
        </p>
        
        <Link href="/" className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/20">
          <Home className="h-5 w-5" />
          <span>Return to the studio</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
