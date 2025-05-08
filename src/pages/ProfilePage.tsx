import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, MapPin, Calendar, Link as LinkIcon, Mail, Edit, Settings } from 'lucide-react';
import RepositoryCard from '../components/Repository/RepositoryCard';
import { Link } from '../components/ui/Link';

interface TabProps {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ active, label, count, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
      active 
        ? 'border-purple-500 text-purple-400' 
        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`ml-2 py-0.5 px-1.5 rounded-full text-xs ${
        active ? 'bg-purple-900/40 text-purple-300' : 'bg-gray-800 text-gray-400'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState('repositories');
  
  // Mock data for user profile
  const userProfile = {
    username: username || 'producer1',
    displayName: 'Alex Producer',
    bio: 'Music producer specializing in EDM and Trap. FL Studio enthusiast for over 8 years.',
    location: 'Los Angeles, CA',
    joined: 'March 2025',
    website: 'https://producer.me',
    email: 'alex@producer.me',
    isCurrentUser: true
  };
  
  // Mock data for repositories
  const repositories = [
    {
      title: "EDM-Festival-Banger",
      description: "An energetic EDM track designed for festival main stages. Features a massive drop and vocal chops.",
      username: username || 'producer1',
      stars: 132,
      forks: 19,
      lastUpdated: "1 week ago",
      genre: "EDM",
      bpm: 128
    },
    {
      title: "Trap-Beat-Collection",
      description: "A collection of trap beats with heavy 808s and unique percussion. Looking for vocal collaborators.",
      username: username || 'producer1',
      stars: 89,
      forks: 12,
      lastUpdated: "5 days ago",
      genre: "Trap",
      bpm: 140
    },
    {
      title: "Lo-Fi-Chill-Beats",
      description: "Relaxing lo-fi hip hop beats perfect for studying or chilling. Features vinyl crackles and jazz samples.",
      username: username || 'producer1',
      stars: 67,
      forks: 8,
      lastUpdated: "2 weeks ago",
      genre: "Lo-Fi",
      bpm: 85
    }
  ];
  
  // Mock data for forks
  const forks = [
    {
      title: "Deep-House-Project",
      description: "A deep house track with complex layering and custom synths. I've added a new breakdown section.",
      username: "beatmaker99",
      stars: 3,
      forks: 0,
      lastUpdated: "1 day ago",
      genre: "Deep House",
      bpm: 124
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="flex flex-col items-center lg:items-start">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-800 mb-4">
                  <img
                    src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=96&w=96"
                    alt={userProfile.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-1">{userProfile.displayName}</h1>
                <h2 className="text-lg text-gray-400 mb-4">@{userProfile.username}</h2>
                
                {userProfile.isCurrentUser ? (
                  <div className="flex space-x-2 w-full mb-6">
                    <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-800 hover:bg-gray-750 text-white py-2 px-4 rounded-md transition-colors border border-gray-700">
                      <Edit className="h-4 w-4" />
                      <span>Edit profile</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-750 text-white rounded-md transition-colors border border-gray-700">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors mb-6">
                    Follow
                  </button>
                )}
                
                <div className="w-full space-y-4">
                  {userProfile.bio && (
                    <p className="text-gray-300">{userProfile.bio}</p>
                  )}
                  
                  <div className="space-y-2">
                    {userProfile.location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{userProfile.location}</span>
                      </div>
                    )}
                    
                    {userProfile.website && (
                      <div className="flex items-center text-gray-400">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        <a href={userProfile.website} className="text-purple-400 hover:underline truncate" target="_blank" rel="noopener noreferrer">
                          {userProfile.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    {userProfile.email && (
                      <div className="flex items-center text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${userProfile.email}`} className="text-purple-400 hover:underline truncate">
                          {userProfile.email}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Joined {userProfile.joined}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-700 mb-6">
              <div className="flex space-x-4">
                <Tab
                  active={activeTab === 'repositories'}
                  label="Repositories"
                  count={repositories.length}
                  onClick={() => setActiveTab('repositories')}
                />
                
                <Tab
                  active={activeTab === 'forks'}
                  label="Forks"
                  count={forks.length}
                  onClick={() => setActiveTab('forks')}
                />
                
                <Tab
                  active={activeTab === 'stars'}
                  label="Stars"
                  count={5}
                  onClick={() => setActiveTab('stars')}
                />
                
                <Tab
                  active={activeTab === 'followers'}
                  label="Followers"
                  count={12}
                  onClick={() => setActiveTab('followers')}
                />
                
                <Tab
                  active={activeTab === 'following'}
                  label="Following"
                  count={8}
                  onClick={() => setActiveTab('following')}
                />
              </div>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'repositories' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Repositories</h2>
                  {userProfile.isCurrentUser && (
                    <Link href="/new" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors">
                      New
                    </Link>
                  )}
                </div>
                
                <div className="space-y-4">
                  {repositories.map((repo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <RepositoryCard {...repo} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'forks' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Forked Repositories</h2>
                <div className="space-y-4">
                  {forks.map((repo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <RepositoryCard {...repo} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'stars' && (
              <div className="text-center py-12">
                <Music2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No starred repositories yet</h3>
                <p className="text-gray-400">
                  {userProfile.isCurrentUser 
                    ? "You haven't starred any repositories yet."
                    : `${userProfile.displayName} hasn't starred any repositories yet.`}
                </p>
              </div>
            )}
            
            {(activeTab === 'followers' || activeTab === 'following') && (
              <div className="text-center py-12">
                <Music2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  {activeTab === 'followers' ? 'Follower list' : 'Following list'} coming soon
                </h3>
                <p className="text-gray-400">
                  This feature is currently in development.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;