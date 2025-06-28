import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaGlobe, FaHeart, FaComment, FaShare, FaEllipsisV } from 'react-icons/fa';

interface Repository {
  id: number;
  name: string;
  owner: string;
  isPrivate: boolean;
  tags: string[];
  key: string;
  bpm: number;
  likes: number;
  comments: number;
  description: string;
  genre: string;
  instruments: string[];
  createdAt: string;
}

const RepositoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      id: 1,
      name: 'Summer Vibes',
      owner: 'johndoe',
      isPrivate: false,
      tags: ['Pop', 'Summer'],
      key: 'C Major',
      bpm: 120,
      likes: 42,
      comments: 15,
      description: 'A cheerful summer pop track with tropical influences',
      genre: 'Pop',
      instruments: ['Guitar', 'Drums', 'Synth'],
      createdAt: '2024-03-15'
    },
    {
      id: 2,
      name: 'Midnight Jazz',
      owner: 'sarahsmith',
      isPrivate: true,
      tags: ['Jazz', 'Night'],
      key: 'D Minor',
      bpm: 95,
      likes: 28,
      comments: 9,
      description: 'Smooth jazz composition perfect for late night listening',
      genre: 'Jazz',
      instruments: ['Saxophone', 'Piano', 'Bass'],
      createdAt: '2024-03-10'
    },
    {
      id: 3,
      name: 'Rock Revolution',
      owner: 'mikebrown',
      isPrivate: false,
      tags: ['Rock', 'Electric'],
      key: 'E Major',
      bpm: 140,
      likes: 156,
      comments: 45,
      description: 'High-energy rock track with powerful guitar riffs',
      genre: 'Rock',
      instruments: ['Electric Guitar', 'Drums', 'Bass'],
      createdAt: '2024-03-05'
    },
    {
      id: 4,
      name: 'Classical Dreams',
      owner: 'emilywhite',
      isPrivate: false,
      tags: ['Classical', 'Orchestral'],
      key: 'G Major',
      bpm: 80,
      likes: 89,
      comments: 23,
      description: 'Orchestral composition inspired by classical masters',
      genre: 'Classical',
      instruments: ['Violin', 'Cello', 'Piano'],
      createdAt: '2024-03-01'
    },
    {
      id: 5,
      name: 'Electronic Waves',
      owner: 'alextech',
      isPrivate: true,
      tags: ['Electronic', 'Synthwave'],
      key: 'A Minor',
      bpm: 128,
      likes: 203,
      comments: 67,
      description: 'Retro-futuristic electronic track with modern production',
      genre: 'Electronic',
      instruments: ['Synthesizer', 'Drum Machine', 'Sampler'],
      createdAt: '2024-02-28'
    }
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNewRepository = () => {
    navigate('/new-repo');
  };

  const handleRepositoryClick = (owner: string, repoName: string) => {
    navigate(`/${owner}/${repoName}`);
  };

  const handleLike = (repoId: number) => {
    // Implement like functionality
  };

  const handleComment = (repoId: number) => {
    // Implement comment functionality
  };

  const handleShare = (repoId: number) => {
    // Implement share functionality
  };

  const handleReport = (repoId: number) => {
    // Implement report functionality
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button 
          onClick={handleNewRepository}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          New
        </button>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {repositories.map((repo) => (
          <div 
            key={repo.id} 
            className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 hover:border-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all backdrop-blur-sm"
          >
            <div className="flex items-center mb-3">
              <h2 
                className="text-lg font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer hover:underline"
                onClick={() => handleRepositoryClick(repo.owner, repo.name)}
              >
                {repo.name}
              </h2>
              {repo.isPrivate ? (
                <FaLock className="ml-2 text-gray-400" />
              ) : (
                <FaGlobe className="ml-2 text-gray-400" />
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex gap-2">
                {repo.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-gray-400 text-sm">
                <span>Key: {repo.key}</span>
                <span>BPM: {repo.bpm}</span>
                <span>Genre: {repo.genre}</span>
              </div>
            </div>

            <div className="flex gap-4 border-t border-gray-700 pt-3">
              <button 
                onClick={() => handleLike(repo.id)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2 py-1 rounded transition-colors"
              >
                <FaHeart /> {repo.likes}
              </button>
              <button 
                onClick={() => handleComment(repo.id)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2 py-1 rounded transition-colors"
              >
                <FaComment /> {repo.comments}
              </button>
              <button 
                onClick={() => handleShare(repo.id)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2 py-1 rounded transition-colors"
              >
                <FaShare />
              </button>
              <button 
                onClick={() => handleReport(repo.id)}
                className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2 py-1 rounded transition-colors"
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoriesPage;
