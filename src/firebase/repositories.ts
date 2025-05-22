import { db, storage } from './config';
import {
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { uploadMultipleFiles, STORAGE_PATHS, StorageFile } from './storage';

export interface Repository {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerUsername: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  genre?: string;
  bpm?: number;
}

export interface Branch {
  id: string;
  name: string;
  repositoryId: string;
  isDefault: boolean;
  createdAt: Timestamp;
  lastCommitId?: string;
}

export interface Commit {
  id: string;
  message: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  branchId: string;
  repositoryId: string;
  parentCommitId?: string;
  files: CommitFile[];
  createdAt: Timestamp;
}

export interface CommitFile {
  name: string;
  type: 'flp' | 'wav' | 'mp3' | 'other';
  path: string;
  size: number;
  url: string;
}

// Repository functions
export const getRepositories = async (limitCount = 10): Promise<Repository[]> => {
  try {
    const reposRef = collection(db, 'repositories');
    const reposQuery = query(
      reposRef,
      where('isPrivate', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(reposQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Repository));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getUserRepositories = async (userId: string): Promise<Repository[]> => {
  try {
    const reposRef = collection(db, 'repositories');
    const reposQuery = query(
      reposRef,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(reposQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Repository));
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    throw error;
  }
};

export const getRepository = async (repoId: string): Promise<Repository> => {
  try {
    const docRef = doc(db, 'repositories', repoId);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Repository;
    } else {
      throw new Error('Repository not found');
    }
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
};

export const createRepository = async (repository: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // Create the repository document
    const reposRef = collection(db, 'repositories');
    const docRef = await addDoc(reposRef, {
      ...repository,
      stars: 0,
      forks: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Create default 'main' branch
    const branchesRef = collection(db, 'branches');
    await addDoc(branchesRef, {
      name: 'main',
      repositoryId: docRef.id,
      isDefault: true,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating repository:', error);
    throw error;
  }
};

// Branch functions
export const getBranches = async (repositoryId: string): Promise<Branch[]> => {
  try {
    const branchesRef = collection(db, 'branches');
    const branchesQuery = query(
      branchesRef,
      where('repositoryId', '==', repositoryId)
    );
    
    const snapshot = await getDocs(branchesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Branch));
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const createBranch = async (branch: Omit<Branch, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const branchesRef = collection(db, 'branches');
    const docRef = await addDoc(branchesRef, {
      ...branch,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

// Commit functions
export const getCommits = async (repositoryId: string, branchId: string): Promise<Commit[]> => {
  try {
    const commitsRef = collection(db, 'commits');
    const commitsQuery = query(
      commitsRef,
      where('repositoryId', '==', repositoryId),
      where('branchId', '==', branchId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(commitsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Commit));
  } catch (error) {
    console.error('Error fetching commits:', error);
    throw error;
  }
};

export const createCommit = async (
  commit: Omit<Commit, 'id' | 'createdAt'>,
  files: { file: File, type: 'flp' | 'wav' | 'mp3' | 'other' }[]
): Promise<string> => {
  try {
    // Upload files to storage using the utility
    const uploadedFiles = await uploadMultipleFiles(
      files.map(f => f.file),
      STORAGE_PATHS.REPOSITORY_FILES(commit.repositoryId, commit.branchId)
    );
    
    // Map uploaded files to CommitFile format
    const commitFiles: CommitFile[] = uploadedFiles.map((file, index) => ({
      name: file.name,
      type: files[index].type,
      path: file.path,
      size: file.size,
      url: file.url
    }));
    
    // Create commit document
    const commitsRef = collection(db, 'commits');
    const commitData = {
      ...commit,
      files: commitFiles,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(commitsRef, commitData);
    
    // Update branch with last commit id
    const branchRef = doc(db, 'branches', commit.branchId);
    await updateDoc(branchRef, {
      lastCommitId: docRef.id
    });
    
    // Update repository's updatedAt timestamp
    const repoRef = doc(db, 'repositories', commit.repositoryId);
    await updateDoc(repoRef, {
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating commit:', error);
    throw error;
  }
};