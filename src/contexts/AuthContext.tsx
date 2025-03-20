import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  UserCredential,
  reload
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: (User & { role?: string }) | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { role?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin based on email
        const isAdmin = user.email === ADMIN_EMAIL;
        
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...user, role: userData.role });
          } else {
            // If user data doesn't exist, create it
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              displayName: user.displayName,
              role: isAdmin ? 'admin' : 'user',
              isBanned: false,
              createdAt: new Date().toISOString()
            });
            setUser({ ...user, role: isAdmin ? 'admin' : 'user' });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({ ...user, role: isAdmin ? 'admin' : 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });

    // Save user data to Firestore
    const isAdmin = email === ADMIN_EMAIL;
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      displayName,
      role: isAdmin ? 'admin' : 'user',
      isBanned: false,
      createdAt: new Date().toISOString()
    });

    return result;
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUser({ ...result.user, role: userData.role });
    } else {
      // If user data doesn't exist, create it
      const isAdmin = email === ADMIN_EMAIL;
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        role: isAdmin ? 'admin' : 'user',
        isBanned: false,
        createdAt: new Date().toISOString()
      });
      setUser({ ...result.user, role: isAdmin ? 'admin' : 'user' });
    }

    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (displayName: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Update profile in Firestore first
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName
      });

      // Then update profile in Firebase Auth
      await updateProfile(auth.currentUser!, { displayName });
      
      // Update user state
      setUser(prev => prev ? { ...prev, displayName } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
