import React from 'react';
import { Star, GitBranch, Music2 } from 'lucide-react';
import { Link } from '../ui/Link';
import { Repository } from '../../firebase/repositories';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryCardProps extends Repository {}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  id,
  name,
  description,
  ownerUsername,
  stars,
  forks,
  genre,
  bpm,
  updatedAt
}) => {
  const lastUpdated = updatedAt ? formatDistanceToNow(updatedAt.toDate(), { addSuffix: true }) : '';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:bg-gray-750/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/${ownerUsername}/${id}`} className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
            {name}
          </Link>
          <div className="mt-1 text-sm text-gray-400">
            <Link href={`/${ownerUsername}`} className="hover:text-purple-400 transition-colors">
              {ownerUsername}
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{stars}</span>
          </span>
          <span className="flex items-center space-x-1">
            <GitBranch className="h-4 w-4" />
            <span>{forks}</span>
          </span>
        </div>
      </div>

      <p className="mt-4 text-gray-300">{description}</p>

      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-400">
          {genre && (
            <span className="flex items-center space-x-1">
              <Music2 className="h-4 w-4" />
              <span>{genre}</span>
            </span>
          )}
          {bpm && <span>{bpm} BPM</span>}
        </div>
        {lastUpdated && (
          <span className="text-gray-500">Updated {lastUpdated}</span>
        )}
      </div>
    </div>
  );
};

export default RepositoryCard;