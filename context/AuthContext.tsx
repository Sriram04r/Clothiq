import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any | null;
  initializing: boolean;
  wasLoggedIn: boolean;
  userRole: 'customer' | 'driver' | 'admin' | null;
  hasOnboarded: boolean;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
  wasLoggedIn: false,
  userRole: null,
  hasOnboarded: false,
  completeOnboarding: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [wasLoggedIn, setWasLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'driver' | 'admin' | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

    // Handle user state changes
  async function onAuthStateChanged(user: any | null) {
    if (user) {
      setWasLoggedIn(true);
      // Fetch role
      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data?.role === 'admin') {
            setUserRole('admin');
          } else if (data?.role === 'driver') {
            setUserRole('driver');
          } else {
            setUserRole('customer');
          }
        } else {
          setUserRole('customer');
        }
      } catch (err) {
        console.error('Error fetching role', err);
        setUserRole('customer');
      }
    } else {
      setUserRole(null);
    }
    setUser(user);
    // Don't set initializing to false here, we do it after AsyncStorage check
  }

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@has_onboarded', 'true');
      setHasOnboarded(true);
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    
    // Check onboarding status
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@has_onboarded');
        if (value === 'true') {
          setHasOnboarded(true);
        }
      } catch (e) {
        console.error('Failed to load onboarding state', e);
      } finally {
        setInitializing(false);
      }
    };
    
    checkOnboarding();
    
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, wasLoggedIn, userRole, hasOnboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};
