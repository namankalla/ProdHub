import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Compass, 
  Bell, 
  MessageSquare, 
  GitFork, 
  Activity,
  Settings,
  User
} from 'lucide-react';

const sidebarItems = [
  { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/home' },
  { icon: <Compass className="h-5 w-5" />, label: 'Explore', path: '/explore' },
  { icon: <Bell className="h-5 w-5" />, label: 'Notifications', path: '/notifications' },
  { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', path: '/messages' },
  { icon: <GitFork className="h-5 w-5" />, label: 'Collaborations', path: '/collaborations' },
  { icon: <Activity className="h-5 w-5" />, label: 'Activity', path: '/activity' },
  { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 min-h-screen border-r border-gray-800 bg-gray-900/70 backdrop-blur-xl p-6 hidden lg:block"
    >
      <div className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

<<<<<<< Updated upstream
export default Sidebar; 
=======
export default Sidebar;
>>>>>>> Stashed changes
