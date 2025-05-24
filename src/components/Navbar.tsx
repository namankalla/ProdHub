import React, { useState } from 'react';
import { Search, Bell, Menu, X, FolderPlus, Music, MessageSquare, GitPullRequest, HelpCircle, Settings, LogOut, UserCircle, GitFork, Activity, Plus, Compass, TrendingUp, ChevronDown } from 'lucide-react';
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
      className="sticky top-0 z-20 flex items-center justify-between px-10 py-6 border-b border-gray-800 backdrop-blur-xl bg-gray-900/70"
    >
      <Link to="/home" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
        ProdHub
      </Link>

      <div className="flex items-center gap-6">
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
          >
            <img
              src={currentUser?.photoURL || 'https://via.placeholder.com/40'}
              alt="Profile"
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
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;