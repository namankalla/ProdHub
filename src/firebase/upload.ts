import { storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a folder structure to Firebase Storage
 * @param repoId Repository ID to upload to
 * @param files FileList from input element
 * @param onProgress Callback for upload progress
 */
export const uploadRepositoryFolder = async (
  repoId: string,
  files: FileList,
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const uploadPromises = Array.from(files).map(async (file) => {
    // Create storage reference preserving folder structure
    const fileRef = ref(storage, `repositories/${repoId}/${file.webkitRelativePath || file.name}`);
    
    // Upload file
    const snapshot = await uploadBytesResumable(fileRef, file);
    
    // Get download URL
    return getDownloadURL(snapshot.ref);
  });

  // Track progress with individual file observers
  const progressPromises = Array.from(files).map((file, index) => {
    return new Promise<void>((resolve) => {
      const fileRef = ref(storage, `repositories/${repoId}/${file.webkitRelativePath || file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round((index + progress / 100) / files.length * 100));
          }
        },
        (error) => {
          console.error(`Upload error for ${file.name}:`, error);
          resolve();
        },
        () => resolve()
      );
    });
  });

  // Wait for all uploads to complete
  await Promise.all(progressPromises);
  
  // Return all download URLs
  return await Promise.all(uploadPromises);
};
