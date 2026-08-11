import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CircleDot, Building2, Home, MapPin } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy } from '@react-native-firebase/firestore';

export default function SavedAddressesScreen({ navigation }: any) {
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
      setLoading(false);
    }, (error) => {
      console.error('Error fetching addresses:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderIcon = (type: string, isDefault: boolean) => {
    if (isDefault) return <CircleDot size={24} color="#1C158A" strokeWidth={2.5} />;
    
    switch (type?.toLowerCase()) {
      case 'work':
      case 'office':
        return <Building2 size={24} color="#2DD4BF" />;
      case 'home':
        return <Home size={24} color="#10B981" />;
      default:
        return <MapPin size={24} color="#666" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Saved Address</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#1C158A" style={{ marginTop: 40 }} />
          ) : addresses.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>No saved addresses yet.</Text>
          ) : (
            addresses.map((addr, index) => (
              <View key={addr.id} style={styles.addressCard}>
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    {renderIcon(addr.type, addr.isDefault)}
                  </View>
                  <View>
                    <Text style={styles.addressType}>
                      {addr.type} {addr.isDefault && <Text style={styles.defaultText}>(Default)</Text>}
                    </Text>
                    <Text style={styles.addressText}>{addr.houseNo}, {addr.area}</Text>
                    <Text style={styles.addressText}>{addr.city}-{addr.pinCode}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddNewAddress')}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* Add New Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddNewAddress')}
        >
          <Text style={styles.addBtnText}>+ Add New Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    zIndex: 10,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  listContainer: {
    gap: 16,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2', // Light red/pink border matching Figma
    borderRadius: 12,
    backgroundColor: '#FFFBFC', // Slight pink tint
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  defaultText: {
    fontWeight: '400',
    color: '#666',
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  editBtn: {
    padding: 8,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1', // Indigo blue
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  addBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
