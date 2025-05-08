import React, { useState } from 'react';
import { Search, User, Bell, Menu, X, Github, Music } from 'lucide-react';
import { Link } from './ui/Link';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">
              ProdHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search repositories..."
                className="bg-gray-800 text-gray-200 rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Link href="/explore" className="hover:text-purple-400 transition-colors">
              Explore
            </Link>
            <Link href="/trending" className="hover:text-purple-400 transition-colors">
              Trending
            </Link>
            <Link href="/new" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors">
              + New
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="h-8 w-8 bg-gray-700 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=32&w=32"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 py-4 px-4 animate-fadeIn">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search repositories..."
              className="bg-gray-700 text-gray-200 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-7 top-[4.7rem] h-5 w-5 text-gray-400" />
          </div>
          <ul className="space-y-4">
            <li>
              <Link href="/explore" className="block py-2 hover:text-purple-400 transition-colors">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/trending" className="block py-2 hover:text-purple-400 transition-colors">
                Trending
              </Link>
            </li>
            <li>
              <Link href="/new" className="block py-2 text-center bg-purple-600 hover:bg-purple-700 px-4 rounded-md transition-colors">
                + New Repository
              </Link>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center space-x-4 py-2">
              <div className="h-10 w-10 bg-gray-700 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=40&w=40"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium">Producer1</span>
            </div>
            <div className="flex items-center space-x-4 py-2 text-gray-300">
              <Bell className="h-6 w-6" />
              <span>Notifications</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;