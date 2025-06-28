import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, AuthError, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  authLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  authLoading: false,
  error: null,
  login: async () => { throw new Error('Not implemented') },
  signup: async () => { throw new Error('Not implemented') },
  logout: async () => {},
  resetPassword: async () => {},
  clearError: () => {}
});

export const useAuth = () => useContext(AuthContext);

const createUserDocumentIfNotExists = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString(),
    });
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      if (user) {
        console.log('User provider data:', user.providerData);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const resetPassword = async (email: string) => {
    try {
      setAuthLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      const authError = err as AuthError;
      console.log('Error code:', authError.code);
      console.log('Error message:', authError.message);
      
      let errorMessage = 'Failed to send reset email';
      
      switch (authError.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = `Authentication error (${authError.code}): ${authError.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      setError(null);
      console.log('Attempting login with email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.email);
      console.log('Provider data:', result.user.providerData);
      await createUserDocumentIfNotExists(result.user);
      return result;
    } catch (err) {
      console.error('Login error:', err);
      const authError = err as AuthError;
      console.log('Error code:', authError.code);
      console.log('Error message:', authError.message);
      
      let errorMessage = 'Failed to log in';
      
      switch (authError.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. If you signed up with Google, please use the Google sign-in option.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please check your email or sign up.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        default:
          errorMessage = `Authentication error (${authError.code}): ${authError.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      setError(null);
      console.log('Starting signup with:', { email });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', result.user.email);
      console.log('Provider data:', result.user.providerData);
      await createUserDocumentIfNotExists(result.user);
      return result;
    } catch (err) {
      console.error('Signup error:', err);
      const authError = err as AuthError;
      console.log('Error code:', authError.code);
      console.log('Error message:', authError.message);
      
      let errorMessage = 'Failed to create account';
      
      switch (authError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in or use a different email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address. Please check your email format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use at least 6 characters.';
          break;
        default:
          errorMessage = `Authentication error (${authError.code}): ${authError.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      const authError = err as AuthError;
      const errorMessage = authError.code 
        ? `Authentication error (${authError.code}): ${authError.message}`
        : 'Failed to log out';
      setError(errorMessage);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    authLoading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
