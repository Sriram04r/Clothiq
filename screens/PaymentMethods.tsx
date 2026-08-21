import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CreditCard, Plus, MoreVertical, Smartphone, CheckCircle2 } from 'lucide-react-native';

const SAVED_CARDS = [
  { id: '1', type: 'Visa', number: '**** **** **** 4242', expiry: '12/26', isDefault: true, brandColor: '#1A1F71' },
  { id: '2', type: 'Mastercard', number: '**** **** **** 8888', expiry: '08/25', isDefault: false, brandColor: '#EB001B' },
];

const UPI_METHODS = [
  { id: '3', type: 'Google Pay', handle: 'sriram@okicici', isDefault: false },
  { id: '4', type: 'PhonePe', handle: '9876543210@ybl', isDefault: false },
];

export default function PaymentMethodsScreen({ navigation }: any) {
  const [defaultId, setDefaultId] = useState('1');

  const handleSetDefault = (id: string) => {
    setDefaultId(id);
  };

  const handleRemove = () => {
    Alert.alert('Remove Payment Method', 'Are you sure you want to remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Saved Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          
          {SAVED_CARDS.map((card) => {
            const isSelected = defaultId === card.id;
            return (
              <TouchableOpacity 
                key={card.id} 
                style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                activeOpacity={0.7}
                onPress={() => handleSetDefault(card.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardBrandBox, { backgroundColor: card.brandColor }]}>
                    <Text style={styles.cardBrandText}>{card.type}</Text>
                  </View>
                  <TouchableOpacity onPress={handleRemove} style={styles.moreBtn}>
                    <MoreVertical size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardExpiry}>Valid Thru: {card.expiry}</Text>
                    {isSelected && (
                      <View style={styles.defaultBadge}>
                        <CheckCircle2 size={12} color="#1C158A" />
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* UPI Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPI Options</Text>
          
          {UPI_METHODS.map((upi) => {
            const isSelected = defaultId === upi.id;
            return (
              <TouchableOpacity 
                key={upi.id} 
                style={[styles.upiRow, isSelected && styles.upiRowActive]}
                activeOpacity={0.7}
                onPress={() => handleSetDefault(upi.id)}
              >
                <View style={styles.upiIconBox}>
                  <Smartphone size={20} color="#2945FF" />
                </View>
                <View style={styles.upiDetails}>
                  <Text style={styles.upiType}>{upi.type}</Text>
                  <Text style={styles.upiHandle}>{upi.handle}</Text>
                </View>
                {isSelected ? (
                   <CheckCircle2 size={24} color="#1C158A" />
                ) : (
                  <View style={styles.radioEmpty} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Add New Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={() => Alert.alert('Coming Soon', 'Payment Gateway Integration Pending')}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Add New Payment Method</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  paymentCardActive: {
    borderColor: '#2945FF',
    backgroundColor: '#F8FAFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardBrandBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardBrandText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  moreBtn: {
    padding: 4,
  },
  cardDetails: {
    gap: 12,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C158A',
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  upiRowActive: {
    borderColor: '#2945FF',
    backgroundColor: '#F8FAFF',
  },
  upiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upiDetails: {
    flex: 1,
    gap: 2,
  },
  upiType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  upiHandle: {
    fontSize: 13,
    color: '#64748B',
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#1C158A',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1C158A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
