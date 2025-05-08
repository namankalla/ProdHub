import React from 'react';
import { Star, GitBranch, Music2 } from 'lucide-react';
import { Link } from '../ui/Link';

interface RepositoryCardProps {
  title: string;
  description: string;
  username: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  genre?: string;
  bpm?: number;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  title,
  description,
  username,
  stars,
  forks,
  lastUpdated,
  genre,
  bpm
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-purple-500 transition-all duration-300 shadow-md hover:shadow-purple-900/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Music2 className="h-5 w-5 text-purple-400" />
          <Link href={`/${username}/${title}`} className="text-xl font-semibold text-white hover:text-purple-400 transition-colors">
            {username} / {title}
          </Link>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-2">{description}</p>
      
      {/* Music metadata */}
      <div className="flex flex-wrap gap-2 mb-4">
        {genre && (
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
            {genre}
          </span>
        )}
        {bpm && (
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
            {bpm} BPM
          </span>
        )}
      </div>
      
      <div className="flex items-center text-sm text-gray-400 justify-between">
        <div className="flex space-x-4">
          <span className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{stars}</span>
          </span>
          <span className="flex items-center space-x-1">
            <GitBranch className="h-4 w-4" />
            <span>{forks}</span>
          </span>
        </div>
        <span>Updated {lastUpdated}</span>
      </div>
    </div>
  );
};

export default RepositoryCard;