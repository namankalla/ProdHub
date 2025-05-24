import { storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTaskSnapshot } from 'firebase/storage';

export interface UploadProgress {
  progress: number;
  downloadURL: string | null;
  error: Error | null;
}

export interface StorageFile {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

// Upload a file with progress tracking
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<StorageFile> => {
  try {
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${file.name}`;
    const fullPath = `${path}/${uniqueFileName}`;
    const storageRef = ref(storage, fullPath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: fullPath,
              name: file.name,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  path: string,
  onProgress?: (progress: number) => void
): Promise<StorageFile[]> => {
  const totalFiles = files.length;
  let completedFiles = 0;
  const results: StorageFile[] = [];

  for (const file of files) {
    try {
      const result = await uploadFile(file, path, (progress) => {
        const overallProgress = ((completedFiles + progress / 100) / totalFiles) * 100;
        onProgress?.(Math.round(overallProgress));
      });
      results.push(result);
      completedFiles++;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  }

  return results;
};

// Delete a file
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};

// Get file URL
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw error;
  }
};

// Storage paths
export const STORAGE_PATHS = {
  CHAT_MEDIA: (chatId: string, type: string) => `chats/${chatId}/${type}`,
  USER_PROFILE: (userId: string) => `users/${userId}/profile`,
  REPOSITORY_FILES: (repoId: string, branchId: string) => `repositories/${repoId}/branches/${branchId}`,
  USER_UPLOADS: (userId: string) => `uploads/${userId}`,
  PUBLIC_ASSETS: 'public'
}; 