import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createRepository } from '../firebase/repositories';
import { uploadMultipleFiles, STORAGE_PATHS } from '../firebase/storage';
import { FolderUp, X, Loader2 } from 'lucide-react';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface FileWithPath extends File {
  path?: string;
}

const ALLOWED_FILE_TYPES = [
  'image/',
  'video/',
  'audio/',
  'text/',
  'application/pdf',
  'application/json',
  'application/javascript',
  'application/zip',
  'application/octet-stream' // Accept .flp, .fst, .dll etc.
];

const NewRepoPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPath[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    genre: '',
    bpm: ''
  });

  const validateFile = (file: File): boolean => {
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError(`File "${file.name}" exceeds the 100MB limit`);
      return false;
    }

    // Check file type
    const isValidType = ALLOWED_FILE_TYPES.some(type => file.type?.startsWith(type));
    if (!isValidType) {
      // Special case for .fst and .flp files with no MIME type
      if (!file.type && (file.name.endsWith('.fst') || file.name.endsWith('.flp'))) {
        return true;
      }
      setError(`File "${file.name}" is not an allowed type. Allowed types: Images, Videos, Audio, Text, PDF, JSON, JavaScript, ZIP, FLP, FST, and other binary files`);
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(validateFile);
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a repository');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First create the repository
      const repoId = await createRepository({
        name: formData.name,
        description: formData.description,
        ownerId: currentUser.uid,
        ownerUsername: currentUser.email || '',
        isPrivate: formData.isPrivate,
        genre: formData.genre || undefined,
        bpm: formData.bpm ? parseInt(formData.bpm) : undefined,
        stars: 0,
        forks: 0
      });

      // Wait for Firestore to propagate the repository document
      const { getRepository } = await import('../firebase/repositories');
      let repoReady = false;
      for (let i = 0; i < 10; i++) { // Try for up to ~2 seconds
        try {
          const repo = await getRepository(repoId);
          if (repo && repo.ownerId === currentUser.uid) {
            repoReady = true;
            break;
          }
        } catch (e) {
          // Ignore, will retry
        }
        await new Promise(res => setTimeout(res, 200));
      }
      if (!repoReady) {
        setError('Repository creation is taking longer than expected. Please try uploading files again in a moment.');
        setLoading(false);
        return;
      }

      // Then upload files if any
      if (selectedFiles.length > 0) {
        try {
          // Debug log before upload
          console.log('DEBUG: Uploading files', {
            user: currentUser.uid,
            repoId,
            files: selectedFiles.map(f => ({
              name: f.name,
              size: f.size,
              type: f.type,
              webkitRelativePath: (f as any).webkitRelativePath
            }))
          });
          const results = await uploadMultipleFiles(
            selectedFiles,
            `repositories/${repoId}`,
            (progress) => setUploadProgress(progress)
          );
          // Debug log after upload
          console.log('DEBUG: Upload results', results);
        } catch (uploadError) {
          // Debug log error
          console.error('DEBUG: Error uploading files', uploadError);
          setError(
            'Repository created but failed to upload some files. You can try uploading them again later. ' +
            (uploadError instanceof Error && uploadError.message ? uploadError.message : '')
          );
          // Still navigate to the repository page even if upload fails
          navigate(`/repository/${repoId}`);
          return;
        }
      }

      navigate(`/repository/${repoId}`);
    } catch (err) {
      console.error('Error creating repository:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the repository');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(validateFile);
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-400 mb-8">Create New Repository</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/70 border border-gray-700 p-6 rounded-lg backdrop-blur-sm">
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-md border border-red-500/20">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Repository Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2.5 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2.5 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="bpm" className="block text-sm font-medium text-gray-300">
              BPM
            </label>
            <input
              type="number"
              id="bpm"
              name="bpm"
              value={formData.bpm}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center">
        <input
      id="file-upload"
    name="file-upload"
  type="file"
  multiple
  webkitdirectory="" 
  directory="" 
  accept="image/*,video/*,audio/*,text/*,application/pdf,application/zip"
  ref={fileInputRef}
  onChange={handleFileSelect}
  className="sr-only"
/>

          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-300">
            Make this repository private
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Files
          </label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-gray-600 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <FolderUp className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    webkitdirectory=""
                    directory=""
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Allowed types: Images, Videos, Audio, Text, PDF, FLP, FST, and other files (max 100MB)
              </p>
            </div>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Selected Files:</h3>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded border border-gray-700">
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <span className="text-sm">
              {uploadProgress > 0 ? `Uploading: ${uploadProgress}%` : 'Creating repository...'}
            </span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Repository
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRepoPage;
