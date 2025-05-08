import React, { useState } from 'react';
import { GitBranch, ChevronDown, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Branch {
  id: string;
  name: string;
  isDefault?: boolean;
}

interface BranchSelectorProps {
  branches: Branch[];
  currentBranch: string;
  onBranchChange: (branchId: string) => void;
  onCreateBranch?: () => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  currentBranch,
  onBranchChange,
  onCreateBranch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentBranchObj = branches.find(b => b.id === currentBranch) || branches[0];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleBranchSelect = (branchId: string) => {
    onBranchChange(branchId);
    setIsOpen(false);
  };

  return (
    <div className="relative z-10">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-750 text-gray-200 py-1.5 px-3 rounded-md transition-colors"
      >
        <GitBranch className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{currentBranchObj?.name || 'main'}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-2 w-56 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 overflow-hidden"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Branches</div>
              <div className="max-h-60 overflow-auto py-1">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                      branch.id === currentBranch
                        ? 'bg-purple-700/30 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4" />
                      <span>{branch.name}</span>
                      {branch.isDefault && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded-full">
                          default
                        </span>
                      )}
                    </div>
                    {branch.id === currentBranch && <Check className="h-4 w-4 text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>
            
            {onCreateBranch && (
              <div className="p-1">
                <button
                  onClick={() => { 
                    onCreateBranch();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <Plus className="h-4 w-4 text-purple-400" />
                  <span>Create new branch</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BranchSelector;