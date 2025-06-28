import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { uploadRepositoryFolder } from '../../firebase/upload';

interface RepositoryUploaderProps {
  repoId: string;
}

export const RepositoryUploader: React.FC<RepositoryUploaderProps> = ({ repoId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const handleFolderUpload = async () => {
    setUploading(true);
    setError(null);
    setUploadedFiles([]);

    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.webkitdirectory = true;
      fileInput.multiple = true;

      fileInput.addEventListener('change', async () => {
        if (!fileInput.files) return;

        try {
          const urls = await uploadRepositoryFolder(repoId, fileInput.files, (progress) => {
            setProgress(progress);
          });

          // Map files to file names and URLs
          const filesWithUrls = Array.from(fileInput.files).map((file, index) => ({
            name: file.name,
            url: urls[index],
          }));

          setUploadedFiles(filesWithUrls);
        } catch (err) {
          setError('Upload failed. Please try again.');
          console.error('Upload error:', err);
        } finally {
          setUploading(false);
        }
      });

      fileInput.click();
    } catch (err) {
      setError('Failed to initialize upload. Please check your connection.');
      console.error('Uploader error:', err);
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <Button
        onClick={handleFolderUpload}
        disabled={uploading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading... {progress}%</span>
          </div>
        ) : (
          'Upload Repository Folder'
        )}
      </Button>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Uploaded Files:</h3>
          <div className="max-h-40 overflow-y-auto bg-gray-900 rounded-lg p-3 border border-gray-700">
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-200">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
