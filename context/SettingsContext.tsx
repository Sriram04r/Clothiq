import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';

export type AppConfig = {
  acceptOrders: boolean;
  baseDeliveryFee: number;
  expressDeliveryFee: number;
  taxPercentage: number;
};

export type CatalogSettings = {
  categories: string[];
  services: string[];
};

export type TimeSlotSettings = {
  slots: string[];
};

type SettingsContextType = {
  appConfig: AppConfig;
  catalog: CatalogSettings;
  timeSlots: TimeSlotSettings;
  loading: boolean;
};

const defaultAppConfig = {
  acceptOrders: true,
  baseDeliveryFee: 40,
  expressDeliveryFee: 50,
  taxPercentage: 5
};

const defaultCatalog = {
  categories: ['Men', 'Women', 'Kids', 'Household'],
  services: ['Wash & Fold', 'Dry Cleaning', 'Steam Iron', 'Wash & Iron']
};

const defaultTimeSlots = {
  slots: ['9 AM – 11 AM', '11 AM – 1 PM', '1 PM – 3 PM', '3 PM – 5 PM', '5 PM – 7 PM']
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppConfig);
  const [catalog, setCatalog] = useState<CatalogSettings>(defaultCatalog);
  const [timeSlots, setTimeSlots] = useState<TimeSlotSettings>(defaultTimeSlots);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();
    let loadedCount = 0;
    const checkLoading = () => {
      loadedCount++;
      if (loadedCount >= 3) setLoading(false);
    };

    const unsubApp = onSnapshot(doc(db, 'master_settings', 'app_config'), (snap) => {
      if (snap.exists) setAppConfig(snap.data() as AppConfig);
      checkLoading();
    });

    const unsubCatalog = onSnapshot(doc(db, 'master_settings', 'catalog'), (snap) => {
      if (snap.exists) setCatalog(snap.data() as CatalogSettings);
      checkLoading();
    });

    const unsubTime = onSnapshot(doc(db, 'master_settings', 'time_slots'), (snap) => {
      if (snap.exists) setTimeSlots({ slots: snap.data()?.slots || defaultTimeSlots.slots });
      checkLoading();
    });

    return () => {
      unsubApp();
      unsubCatalog();
      unsubTime();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ appConfig, catalog, timeSlots, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
