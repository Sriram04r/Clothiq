import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  wasLoggedIn: boolean;
  hasOnboarded: boolean;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
  wasLoggedIn: false,
  hasOnboarded: false,
  completeOnboarding: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [wasLoggedIn, setWasLoggedIn] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) setWasLoggedIn(true);
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
        // TEMPORARY: Reset onboarding so you can test it on Expo Go
        await AsyncStorage.removeItem('@has_onboarded');
        
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
    <AuthContext.Provider value={{ user, initializing, wasLoggedIn, hasOnboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};
