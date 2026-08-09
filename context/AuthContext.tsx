import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  wasLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
  wasLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [wasLoggedIn, setWasLoggedIn] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) setWasLoggedIn(true);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const auth = getAuth();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, wasLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
