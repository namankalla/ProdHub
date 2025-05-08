import React, { useState } from 'react';
import { useParams, Routes, Route } from 'react-router-dom';
import { Star, GitBranch, Share2, Download, GitFork, Music2, Info } from 'lucide-react';
import BranchSelector from '../components/Repository/BranchSelector';
import CommitHistory from '../components/Repository/CommitHistory';
import AudioPlayer from '../components/Repository/AudioPlayer';
import { Link } from '../components/ui/Link';
import { motion } from 'framer-motion';

const RepositoryPage: React.FC = () => {
  const { username, repoName } = useParams<{ username: string; repoName: string }>();
  const [currentBranchId, setCurrentBranchId] = useState('branch-1');
  
  // Mock data
  const repository = {
    name: repoName || 'Repository',
    description: 'A professional-grade EDM track with layered synths and complex percussion patterns. Ready for collaboration.',
    stars: 132,
    forks: 27,
    lastUpdated: '2 days ago',
    genre: 'EDM',
    bpm: 128,
    isStarred: false,
    isForked: false
  };
  
  const branches = [
    { id: 'branch-1', name: 'main', isDefault: true },
    { id: 'branch-2', name: 'feature/new-drop' },
    { id: 'branch-3', name: 'feature/vocals' },
    { id: 'branch-4', name: 'experimental/breakbeat' }
  ];
  
  const commits = [
    { 
      id: 'commit1', 
      message: 'Added new bassline and adjusted mix levels', 
      author: username || 'Producer1', 
      date: '2 days ago',
      avatar: 'https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=40&w=40'
    },
    { 
      id: 'commit2', 
      message: 'Fixed clipping issues in the drop section', 
      author: username || 'Producer1', 
      date: '3 days ago',
      avatar: 'https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=40&w=40'
    },
    { 
      id: 'commit3', 
      message: 'Initial project setup with basic structure', 
      author: username || 'Producer1', 
      date: '5 days ago',
      avatar: 'https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=40&w=40'
    }
  ];
  
  const files = [
    {
      name: 'EDM_Project.flp',
      type: 'flp',
      size: '2.4 MB',
      lastUpdated: '2 days ago'
    },
    {
      name: 'EDM_Project_Full.wav',
      type: 'wav',
      size: '48.2 MB',
      lastUpdated: '2 days ago'
    },
    {
      name: 'EDM_Project_Full.mp3',
      type: 'mp3',
      size: '6.8 MB',
      lastUpdated: '2 days ago',
      url: 'https://cdn.freesound.org/previews/531/531479_5674468-lq.mp3'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        {/* Repository Header */}
        <div className="mb-8">
          <div className="flex items-center text-gray-400 mb-2">
            <Link href={`/${username}`} className="hover:text-purple-400 transition-colors">
              {username}
            </Link>
            <span className="mx-2">/</span>
            <h1 className="text-xl font-semibold text-white">{repository.name}</h1>
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-800 rounded-full border border-gray-700">
              Public
            </span>
          </div>
          
          <p className="text-gray-300 mb-4">{repository.description}</p>
          
          {/* Repository metadata */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center">
              <button className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-750 text-white py-1.5 px-3 rounded-md transition-colors border border-gray-700">
                <Star className={`h-4 w-4 ${repository.isStarred ? 'text-amber-400' : 'text-gray-400'}`} />
                <span>Star</span>
                <span className="bg-gray-700 px-1.5 rounded-md ml-1">{repository.stars}</span>
              </button>
            </div>
            
            <div className="flex items-center">
              <button className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-750 text-white py-1.5 px-3 rounded-md transition-colors border border-gray-700">
                <GitFork className="h-4 w-4 text-gray-400" />
                <span>Fork</span>
                <span className="bg-gray-700 px-1.5 rounded-md ml-1">{repository.forks}</span>
              </button>
            </div>
            
            <div className="flex items-center">
              <button className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-750 text-white py-1.5 px-3 rounded-md transition-colors border border-gray-700">
                <Share2 className="h-4 w-4 text-gray-400" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {repository.genre && (
              <span className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700 flex items-center">
                <Music2 className="h-3.5 w-3.5 mr-1 text-purple-400" />
                {repository.genre}
              </span>
            )}
            {repository.bpm && (
              <span className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700">
                {repository.bpm} BPM
              </span>
            )}
            <span className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700">
              Updated {repository.lastUpdated}
            </span>
          </div>
        </div>
        
        {/* Repository Navigation */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-700 mb-6 pb-2">
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            <BranchSelector 
              branches={branches}
              currentBranch={currentBranchId}
              onBranchChange={setCurrentBranchId}
              onCreateBranch={() => console.log("Create new branch")}
            />
          </div>
          
          <div className="flex items-center space-x-3 mt-3 md:mt-0">
            <button className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-750 text-white py-1.5 px-3 rounded-md transition-colors">
              <Download className="h-4 w-4 text-gray-400" />
              <span>Download</span>
            </button>
            
            <button className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-4 rounded-md transition-colors">
              <GitBranch className="h-4 w-4" />
              <span>New Commit</span>
            </button>
          </div>
        </div>
        
        {/* Repository Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Audio Preview */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700 p-4">
              <h2 className="text-lg font-medium text-white mb-4">Audio Preview</h2>
              <AudioPlayer 
                audioUrl={files.find(f => f.type === 'mp3')?.url || ''}
                title={`${repository.name} - Full Track`}
              />
            </div>
            
            {/* Files */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Files</h2>
                <div className="text-sm text-gray-400">
                  Latest commit: {commits[0].id.substring(0, 7)}
                </div>
              </div>
              
              <div className="divide-y divide-gray-700">
                {files.map((file, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-750 transition-colors flex items-center justify-between">
                    <div className="flex items-center">
                      {file.type === 'flp' && <Music2 className="h-5 w-5 text-orange-400 mr-3" />}
                      {file.type === 'wav' && <Music2 className="h-5 w-5 text-cyan-400 mr-3" />}
                      {file.type === 'mp3' && <Music2 className="h-5 w-5 text-purple-400 mr-3" />}
                      <div>
                        <div className="text-white">{file.name}</div>
                        <div className="text-xs text-gray-400">
                          {file.size} • Updated {file.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Project Readme/Description */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-white">About This Project</h2>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p>
                  This is an EDM track built in FL Studio 20. The project includes custom synth presets and a carefully designed mixing chain.
                </p>
                <h3>Project Information</h3>
                <ul>
                  <li>Created with FL Studio 20.9</li>
                  <li>BPM: 128</li>
                  <li>Key: F# Minor</li>
                  <li>VSTs: Serum, Massive, Fabfilter Pro-Q 3, OTT</li>
                </ul>
                <h3>Structure</h3>
                <p>
                  The track follows a standard EDM structure with intro, build-up, drop, breakdown, and outro sections. 
                  Each section is color-coded in the project file for easy navigation.
                </p>
                <h3>Collaboration Notes</h3>
                <p>
                  I'm looking for feedback on the mix, especially the balance between the lead synth and bass during the drop section.
                  Feel free to fork the project and suggest improvements!
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Commit History */}
            <CommitHistory 
              commits={commits}
              currentBranch={branches.find(b => b.id === currentBranchId)?.name || 'main'}
            />
            
            {/* About Repo */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">About</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Owner</h3>
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                      <img 
                        src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=30&w=30" 
                        alt={username} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Link href={`/${username}`} className="text-white hover:text-purple-400 transition-colors">
                      {username}
                    </Link>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
                  <div className="text-white">March 15, 2025</div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">License</h3>
                  <div className="text-white">Creative Commons Attribution</div>
                </div>
              </div>
            </div>
            
            {/* Contributors */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Contributors</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                    <img 
                      src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=40&w=40" 
                      alt={username} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <Link href={`/${username}`} className="text-white hover:text-purple-400 transition-colors font-medium">
                      {username}
                    </Link>
                    <div className="text-xs text-gray-400">
                      5 commits
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-2 text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                  View all contributors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;