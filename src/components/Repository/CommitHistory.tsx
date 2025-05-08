import React from 'react';
import { GitCommit, ChevronRight } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  avatar: string;
}

interface CommitHistoryProps {
  commits: Commit[];
  currentBranch: string;
}

const CommitHistory: React.FC<CommitHistoryProps> = ({ commits, currentBranch }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="text-white font-medium">Commit History</div>
        <div className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 flex items-center space-x-1">
          <span>{currentBranch}</span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-700">
        {commits.map((commit) => (
          <div key={commit.id} className="px-4 py-3 hover:bg-gray-750 transition-colors">
            <div className="flex items-start">
              <div className="mt-1 mr-3">
                <GitCommit className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-medium text-white line-clamp-1">{commit.message}</div>
                  <div className="text-xs text-gray-400 whitespace-nowrap ml-2">{commit.date}</div>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-5 w-5 rounded-full overflow-hidden mr-2">
                    <img src={commit.avatar} alt={commit.author} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-gray-300">{commit.author}</span>
                  <span className="text-gray-500 mx-1">•</span>
                  <span className="text-gray-400 font-mono text-xs">{commit.id.substring(0, 7)}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500 ml-2 self-center flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-gray-850 text-center">
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View All Commits
        </button>
      </div>
    </div>
  );
};

export default CommitHistory;