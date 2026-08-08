import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Circle, CheckCircle2 } from 'lucide-react-native';

const addresses = [
  {
    id: 'home',
    title: 'Home',
    line1: 'Sri KrishnaDevaraya Nagar',
    line2: 'Kothapeta-533223',
  },
  {
    id: 'office',
    title: 'Office',
    line1: 'Tech park, 4th floor',
    line2: 'Hyderabad-500001',
  },
  {
    id: 'parents',
    title: 'Parents Home',
    line1: 'Lane 6, MVP Colony',
    line2: 'Vishakapatnam-530017',
  },
];

export default function SelectAddressScreen({ navigation }: any) {
  const [selectedId, setSelectedId] = useState('home');

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
        {addresses.map((address) => {
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
                  <Text style={styles.addressTitle}>{address.title}</Text>
                  {isSelected && address.id === 'home' && (
                    <TouchableOpacity onPress={() => navigation.navigate('AddNewAddress')}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.addressLine}>{address.line1}</Text>
                <Text style={styles.addressLine}>{address.line2}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addAddressBtn} onPress={() => navigation.navigate('AddNewAddress')}>
          <Plus size={20} color="#2945FF" />
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => navigation.navigate('PickupDelivery')}
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
