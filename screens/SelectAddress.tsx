import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Circle, CheckCircle2 } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy } from '@react-native-firebase/firestore';

export default function SelectAddressScreen({ navigation }: any) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const addressesRef = collection(db, 'users', user.uid, 'addresses');
    const q = query(addressesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedAddresses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort so default is always first
      fetchedAddresses.sort((a: any, b: any) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return 0;
      });

      setAddresses(fetchedAddresses);
      
      // Auto-select the default address if we don't have one selected yet
      if (fetchedAddresses.length > 0 && !selectedId) {
        const defaultAddr = fetchedAddresses.find(a => a.isDefault) || fetchedAddresses[0];
        setSelectedId(defaultAddr.id);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching addresses:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select Address</Text>
          <Text style={styles.headerSubtitle}>Where should we pickup?</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#000080" style={{ marginTop: 40 }} />
        ) : addresses.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>No saved addresses yet.</Text>
        ) : (
          addresses.map((address) => {
            const isSelected = selectedId === address.id;
            return (
              <TouchableOpacity 
                key={address.id} 
                style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                onPress={() => setSelectedId(address.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioContainer}>
                  {isSelected ? (
                    <CheckCircle2 size={24} color="#111" />
                  ) : (
                    <Circle size={24} color="#666" />
                  )}
                </View>
                <View style={styles.addressDetails}>
                  <View style={styles.titleRow}>
                    <Text style={styles.addressTitle}>
                      {address.type} {address.isDefault && <Text style={{fontSize: 12, color: '#666', fontWeight: '400'}}>(Default)</Text>}
                    </Text>
                    {isSelected && (
                      <TouchableOpacity onPress={() => navigation.navigate('AddNewAddress')}>
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.addressLine}>{address.houseNo}, {address.area}</Text>
                  <Text style={styles.addressLine}>{address.city}-{address.pinCode}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity style={styles.addAddressBtn} onPress={() => navigation.navigate('AddNewAddress')}>
          <Plus size={20} color="#2945FF" />
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.continueBtn, !selectedId && { opacity: 0.5 }]}
          onPress={() => selectedId && navigation.navigate('PickupDelivery', { selectedAddressId: selectedId })}
          disabled={!selectedId}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
    marginTop: -32,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFF0F5', // very light pink/red matching screenshot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  addressCardSelected: {
    borderColor: '#E8E8E8',
  },
  radioContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  addressDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  editText: {
    fontSize: 14,
    color: '#8A91F6', // light purplish blue
    fontWeight: '500',
  },
  addressLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  addAddressText: {
    color: '#8A91F6',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  continueBtn: {
    backgroundColor: '#000080',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
