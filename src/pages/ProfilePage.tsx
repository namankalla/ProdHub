import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, MapPin, Calendar, Link as LinkIcon, Mail, Edit, Settings, ChevronDown, User, Users, Link2, GitFork, Folder } from 'lucide-react';
import RepositoryCard from '../components/Repository/RepositoryCard';
import { Link } from '../components/ui/Link';
import { BackButton } from '../components/ui/BackButton';
import { useAuth } from '../contexts/AuthContext';
import { getUserRepositories, Repository } from '../firebase/repositories';
import CountUp from 'react-countup';
import { getUserProfile } from '../firebase/users';

interface TabProps {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ active, label, count, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
      active
        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
        : 'text-gray-400 hover:text-white border border-transparent'
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`ml-2 ${active ? 'text-purple-400' : 'text-gray-500'}`}>
        {count}
      </span>
    )}
  </button>
);

const sidebarItems = [
  { icon: <Folder />, label: 'Repositories', href: '/repositories' },
  { icon: <GitFork />, label: 'Collaborations', href: '/collaborations' },
  { icon: <Users />, label: 'Connects', href: '/connects' },
  { icon: <User />, label: 'Profile', href: '/profile' },
  { icon: <Settings />, label: 'Settings', href: '/settings' },
];

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
      }
    };
    fetchProfile();
  }, [currentUser]);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        if (currentUser?.uid) {
          const repos = await getUserRepositories(currentUser.uid);
          setRepositories(repos);
        }
      } catch (e) {
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [currentUser]);

  // Use Firestore profile for all custom fields
  const user = {
    name: profile?.displayName || currentUser?.displayName || 'User Name',
    username: profile?.username || 'username',
    avatar: profile?.avatarUrl || currentUser?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
    bio: profile?.bio || '',
    followers: 0,
    following: 0,
    connects: 0,
    role: 'Music Producer',
  };

  // Settings dropdown close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettings]);

  // Stats for cards
  const stats = [
    { label: 'Total Repositories', count: repositories.length, icon: <Folder className="h-5 w-5 text-purple-400" /> },
    { label: 'Projects', count: repositories.length, icon: <Music2 className="h-5 w-5 text-cyan-400" /> },
    { label: 'Collaborations', count: 0, icon: <GitFork className="h-5 w-5 text-green-400" /> },
  ];

  // Social stats
  const socialStats = [
    { label: 'Followers', count: user.followers, href: '/followers' },
    { label: 'Following', count: user.following, href: '/following' },
    { label: 'Connects', count: user.connects, href: '/connects' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 flex flex-col">
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header with glassmorphism and motion */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-20 flex items-center justify-between px-10 py-6 border-b border-gray-800 backdrop-blur bg-gray-900/70"
        >
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <div className="flex items-center gap-4 relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 rounded-lg px-4 py-2 text-white outline-none border border-gray-700 focus:border-purple-500 transition-colors"
              style={{ minWidth: 200 }}
            />
            <div ref={avatarRef} className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover cursor-pointer"
                onClick={() => setShowSettings((v) => !v)}
              />
              <button
                className="absolute right-0 top-0 bg-gray-800/80 rounded-full p-1 border border-gray-700"
                onClick={() => setShowSettings((v) => !v)}
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
                >
                  <RouterLink to="/edit-profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-t-lg">Edit Profile</RouterLink>
                  <RouterLink to="/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Settings</RouterLink>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-b-lg">Logout</button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 p-6 md:p-10 bg-gray-900/80">
          {/* Profile Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-gray-800/50 rounded-xl border border-gray-700/50 p-8 flex flex-col items-center shadow-lg relative mx-auto lg:mx-0"
          >
            {/* Avatar */}
            <img src={user.avatar} alt={user.name} className="w-40 h-40 rounded-full object-cover border-4 border-purple-600 shadow-lg mb-4" />
            {/* Name, Username, Role, Bio */}
            <div className="text-2xl font-bold text-white mb-1">{user.name}</div>
            <div className="text-gray-400 text-base mb-1">@{user.username}</div>
            <div className="text-purple-400 text-sm mb-2 font-semibold">{user.role}</div>
            {user.bio && (
              <div className="text-gray-300 text-sm mb-4 text-center w-full break-words">{user.bio}</div>
            )}
            {/* Social Stats as cards */}
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
              {socialStats.map((item) => (
                <RouterLink
                  key={item.label}
                  to={item.href}
                  className="text-center p-3 rounded-lg bg-gray-700/40 border border-gray-700 hover:border-purple-500 transition group"
                >
                  <div className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    <CountUp end={item.count} duration={1} />
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">{item.label}</div>
                </RouterLink>
              ))}
            </div>
          </motion.section>
          {/* Main Cards/Sections */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Stats Cards Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {stats.map((item) => (
                <div key={item.label} className="bg-gray-800/50 border border-gray-700/60 rounded-xl p-6 shadow-sm hover:shadow-purple-500/20 transition flex flex-col items-center">
                  <div className="mb-2">{item.icon}</div>
                  <div className="text-3xl font-bold text-white">
                    <CountUp end={item.count} duration={1.2} />
                  </div>
                  <div className="text-sm text-gray-400">{item.label}</div>
                </div>
              ))}
            </motion.div>
            {/* Repositories Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Repositories</h3>
                <RouterLink to="/repositories" className="text-purple-400 hover:underline text-sm">View All</RouterLink>
              </div>
              {loading ? (
                <div className="text-gray-400 text-sm">Loading repositories...</div>
              ) : repositories.length === 0 ? (
                <p className="text-gray-500 text-sm">No repositories found.</p>
              ) : (
                <div className="space-y-4">
                  {repositories.map(repo => (
                    <RepositoryCard key={repo.id} {...repo} />
                  ))}
                </div>
              )}
            </motion.section>
            {/* Placeholder for activity heatmap/calendar */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
            >
              <div className="text-white font-semibold mb-2">Activity</div>
              <div className="h-32 flex items-center justify-center text-gray-500">(Activity heatmap/calendar coming soon)</div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;