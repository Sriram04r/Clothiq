import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CircleDot, Building2, Home } from 'lucide-react-native';

const savedAddresses = [
  {
    id: '1',
    type: 'Home',
    isDefault: true,
    address1: 'Sri KrishnaDevaraya Nagar',
    address2: 'Kothapeta-533223',
    icon: 'home-default'
  },
  {
    id: '2',
    type: 'Office',
    isDefault: false,
    address1: 'Tech park, 4th Floor',
    address2: 'Hyderabad-500001',
    icon: 'office'
  },
  {
    id: '3',
    type: 'Parents Home',
    isDefault: false,
    address1: 'Lane 6, MVP Colony,',
    address2: 'Vishakapatnam-533017',
    icon: 'home'
  }
];

export default function SavedAddressesScreen({ navigation }: any) {
  
  const renderIcon = (type: string) => {
    switch (type) {
      case 'home-default':
        return <CircleDot size={24} color="#111" strokeWidth={2.5} />;
      case 'office':
        return <Building2 size={24} color="#2DD4BF" />;
      case 'home':
        return <Home size={24} color="#10B981" />;
      default:
        return <Home size={24} color="#666" />;
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
          {savedAddresses.map((addr, index) => (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                  {renderIcon(addr.icon)}
                </View>
                <View>
                  <Text style={styles.addressType}>
                    {addr.type} {addr.isDefault && <Text style={styles.defaultText}>(Default)</Text>}
                  </Text>
                  <Text style={styles.addressText}>{addr.address1}</Text>
                  <Text style={styles.addressText}>{addr.address2}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddNewAddress')}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
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
