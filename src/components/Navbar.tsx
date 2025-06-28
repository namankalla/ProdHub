import React, { useState } from 'react';
<<<<<<< Updated upstream
import { Search, Bell, Menu, X, FolderPlus, Music, MessageSquare, GitPullRequest, HelpCircle, Settings, LogOut, UserCircle, GitFork, Activity, Plus, Compass, TrendingUp, ChevronDown } from 'lucide-react';
=======
import { Bell, Menu, X, FolderPlus, Music, MessageSquare, GitPullRequest, HelpCircle, Settings, LogOut, UserCircle, GitFork, Activity, Plus, Compass, TrendingUp, ChevronDown } from 'lucide-react';
>>>>>>> Stashed changes
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  
  const isWelcomePage = location.pathname === '/';
  const isAuthPage = location.pathname.startsWith('/auth/');

  if (isWelcomePage || isAuthPage) {
    return null;
  }

  const handleLogoClick = () => {
    if (!isWelcomePage && !isAuthPage) {
      navigate('/home');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/signin');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
<<<<<<< Updated upstream
      className="sticky top-0 z-20 flex items-center justify-between px-10 py-6 border-b border-gray-800 backdrop-blur-xl bg-gray-900/70"
    >
      <Link to="/home" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
=======
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/80 shadow-soft-lg"
    >
      <Link 
        to="/home" 
        className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent hover:from-primary-300 hover:to-secondary-300 transition-all duration-300"
      >
>>>>>>> Stashed changes
        ProdHub
      </Link>

      <div className="flex items-center gap-6">
<<<<<<< Updated upstream
        <Link to="/notifications" className="text-gray-400 hover:text-white transition-colors">
          <Bell className="h-6 w-6" />
              </Link>
        <Link to="/messages" className="text-gray-400 hover:text-white transition-colors">
          <MessageSquare className="h-6 w-6" />
              </Link>
        
        {/* Avatar with Settings Dropdown */}
              <div className="relative">
                <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
=======
        <Link 
          to="/repositories" 
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow-glow"
        >
          <GitFork className="h-5 w-5" />
          <span className="font-medium">Your Repositories</span>
        </Link>
        
        {/* Avatar with Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
>>>>>>> Stashed changes
          >
            <img
              src={currentUser?.photoURL || 'https://via.placeholder.com/40'}
              alt="Profile"
<<<<<<< Updated upstream
              className="h-10 w-10 rounded-full border-2 border-gray-700 hover:border-purple-500 transition-colors"
            />
            <ChevronDown className={`h-4 w-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
            {showSettings && (
                        <motion.div
                initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-lg border border-gray-700 overflow-hidden"
                        >
                <div className="py-1">
                              <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              >
                    <UserCircle className="h-4 w-4" />
                    Profile
                              </Link>
                                <Link 
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                              Settings
                            </Link>
                            <button
                              onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                    <LogOut className="h-4 w-4" />
                    Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
=======
              className="h-10 w-10 rounded-full border-2 border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-glow"
            />
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-soft-lg border border-gray-700/50 overflow-hidden"
              >
                <div className="py-1">
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link 
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
>>>>>>> Stashed changes
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
