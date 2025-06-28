import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Star, ExternalLink, Globe, Lock } from 'lucide-react';
import { Link } from '../components/ui/Link';

const HomePage: React.FC = () => {
  const [showNewMenu, setShowNewMenu] = useState(false);

  // Temporary mock data - replace with real data later
  const quickAccessRepos = [
    { id: '1', name: 'My First Project', description: 'A simple FL Studio project', isPrivate: true },
    { id: '2', name: 'Collab Project', description: 'Collaboration with other producers', isPrivate: false }
  ];

  const trendingTopics = [
    { id: '1', title: 'FL Studio 21 Release', views: '10.2k' },
    { id: '2', title: 'Music Production Tips', views: '8.5k' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Quick Access</h2>
                <button
                  onClick={() => setShowNewMenu(!showNewMenu)}
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  {showNewMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50"
                    >
                      <div className="py-1">
                        <Link href="/new/repository" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                          New Repository
                        </Link>
                        <Link href="/new/collaboration-request" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                          Request Collaboration
                        </Link>
                        <Link href="/new/contribute-request" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                          Request to Contribute
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </button>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Your Repositories</h3>
                {quickAccessRepos.map(repo => (
                  <div key={repo.id} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{repo.name}</h4>
                      {repo.isPrivate ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Globe className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{repo.description}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Star className="h-4 w-4 mr-1" />
                      <span>3 stars</span>
                    </div>
                  </div>
                ))}
                <Link href="/repositories" className="block text-sm text-purple-400 hover:text-purple-300 mt-2">
                  <div className="flex items-center">
                    <span>See more</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Activity Feed</h2>
              <div className="text-center text-gray-400 py-8">
                No recent activity
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-white mb-4">Trending Topics</h2>
              <div className="space-y-3">
                {trendingTopics.map(topic => (
                  <div key={topic.id} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">{topic.title}</h4>
                      <span className="text-xs text-gray-400">{topic.views} views</span>
                    </div>
                  </div>
                ))}
                <Link href="/trending" className="block text-sm text-purple-400 hover:text-purple-300 mt-2">
                  <div className="flex items-center">
                    <span>See more</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Featured Courses</h2>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg p-3 border border-purple-500/20">
                  <h4 className="text-white font-medium mb-1">FL Studio Masterclass</h4>
                  <p className="text-sm text-gray-400 mb-2">Learn FL Studio from basics to advanced</p>
                  <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 flex items-center">
                    Learn more
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
