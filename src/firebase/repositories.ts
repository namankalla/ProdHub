import { db, storage } from './config';
import {
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Repository {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerUsername: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  createdAt: any;
  updatedAt: any;
  genre?: string;
  bpm?: number;
}

export interface Branch {
  id: string;
  name: string;
  repositoryId: string;
  isDefault: boolean;
  createdAt: any;
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
  createdAt: any;
}

export interface CommitFile {
  name: string;
  type: 'flp' | 'wav' | 'mp3' | 'other';
  path: string;
  size: number;
  url: string;
}

// Repository functions
export const getRepositories = async (limit = 10) => {
  try {
    const reposQuery = query(
      collection(db, 'repositories'),
      where('isPrivate', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const snapshot = await getDocs(reposQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Repository);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getUserRepositories = async (userId: string) => {
  try {
    const reposQuery = query(
      collection(db, 'repositories'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(reposQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Repository);
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    throw error;
  }
};

export const getRepository = async (repoId: string) => {
  try {
    const docRef = doc(db, 'repositories', repoId);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Repository;
    } else {
      throw new Error('Repository not found');
    }
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
};

export const createRepository = async (repository: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'repositories'), {
      ...repository,
      stars: 0,
      forks: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Create default 'main' branch
    await addDoc(collection(db, 'branches'), {
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
export const getBranches = async (repositoryId: string) => {
  try {
    const branchesQuery = query(
      collection(db, 'branches'),
      where('repositoryId', '==', repositoryId)
    );
    
    const snapshot = await getDocs(branchesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Branch);
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const createBranch = async (branch: Omit<Branch, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'branches'), {
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
export const getCommits = async (repositoryId: string, branchId: string) => {
  try {
    const commitsQuery = query(
      collection(db, 'commits'),
      where('repositoryId', '==', repositoryId),
      where('branchId', '==', branchId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(commitsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Commit);
  } catch (error) {
    console.error('Error fetching commits:', error);
    throw error;
  }
};

export const createCommit = async (
  commit: Omit<Commit, 'id' | 'createdAt'>,
  files: { file: File, type: 'flp' | 'wav' | 'mp3' | 'other' }[]
) => {
  try {
    // Upload files to storage
    const uploadedFiles: CommitFile[] = [];
    
    for (const { file, type } of files) {
      const fileName = file.name;
      const path = `repositories/${commit.repositoryId}/branches/${commit.branchId}/${Date.now()}_${fileName}`;
      const storageRef = ref(storage, path);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      uploadedFiles.push({
        name: fileName,
        type,
        path,
        size: file.size,
        url
      });
    }
    
    // Create commit document
    const commitData = {
      ...commit,
      files: uploadedFiles,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'commits'), commitData);
    
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