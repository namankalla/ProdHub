import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors ${className}`}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>Back</span>
    </button>
  );
<<<<<<< Updated upstream
};
=======
};
>>>>>>> Stashed changes
