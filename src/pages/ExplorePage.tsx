import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Music2 } from 'lucide-react';
import RepositoryCard from '../components/Repository/RepositoryCard';
import { getRepositories, Repository } from '../firebase/repositories';

interface FilterOptions {
  genre: string;
  bpmRange: [number, number];
  sortBy: 'newest' | 'stars' | 'forks';
}

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    genre: 'all',
    bpmRange: [0, 200],
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await getRepositories(10);
        setRepositories(repos);
      } catch (error) {
        console.error('Error loading repositories:', error);
      }
    };

    loadRepositories();
  }, []);
  
  const genres = ['All', 'Deep House', 'Trap', 'Synthwave', 'Lo-Fi', 'EDM', 'Ambient', 'Techno', 'Drum & Bass'];
  
  // Filter repositories based on search and filters
  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.ownerUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.genre && repo.genre.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesGenre = filters.genre === 'all' || 
      (repo.genre && repo.genre.toLowerCase() === filters.genre.toLowerCase());
      
    const matchesBpm = repo.bpm && 
      repo.bpm >= filters.bpmRange[0] && 
      repo.bpm <= filters.bpmRange[1];
      
    return matchesSearch && (filters.genre === 'all' || matchesGenre) && (!repo.bpm || matchesBpm);
  });
  
  // Sort repositories
  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    if (filters.sortBy === 'stars') {
      return b.stars - a.stars;
    } else if (filters.sortBy === 'forks') {
      return b.forks - a.forks;
    }
    // Default to newest
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Projects</h1>
          <p className="text-gray-400">Discover FL Studio projects from producers around the world</p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories, users, or genres..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg py-2.5 px-4 text-white transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre.toLowerCase()}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">BPM Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={filters.bpmRange[0]}
                      onChange={(e) => setFilters({
                        ...filters, 
                        bpmRange: [parseInt(e.target.value), filters.bpmRange[1]]
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={filters.bpmRange[1]}
                      onChange={(e) => setFilters({
                        ...filters, 
                        bpmRange: [filters.bpmRange[0], parseInt(e.target.value)]
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({
                      ...filters, 
                      sortBy: e.target.value as FilterOptions['sortBy']
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  >
                    <option value="newest">Newest</option>
                    <option value="stars">Most Stars</option>
                    <option value="forks">Most Forks</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Results */}
        {sortedRepositories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRepositories.map((repo, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <RepositoryCard {...repo} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
