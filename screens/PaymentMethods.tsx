import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Banknote, QrCode, BookOpen, CheckCircle2 } from 'lucide-react-native';

const PAYMENT_PREFERENCES = [
  { 
    id: 'khata', 
    title: 'Monthly Khata (Tab)', 
    sub: 'Add to your monthly hostel/village tab', 
    icon: <BookOpen size={24} color="#8B5CF6" />, 
    bgColor: '#F5F3FF', 
    borderColor: '#8B5CF6' 
  },
  { 
    id: 'cod', 
    title: 'Cash on Delivery', 
    sub: 'Pay cash to the delivery partner', 
    icon: <Banknote size={24} color="#10B981" />, 
    bgColor: '#ECFDF5', 
    borderColor: '#10B981' 
  },
  { 
    id: 'upi_qr', 
    title: 'UPI QR at Doorstep', 
    sub: "Scan driver's QR when they arrive", 
    icon: <QrCode size={24} color="#3B82F6" />, 
    bgColor: '#EFF6FF', 
    borderColor: '#3B82F6' 
  },
];

export default function PaymentMethodsScreen({ navigation }: any) {
  const [defaultId, setDefaultId] = useState('khata');

  const handleSetDefault = (id: string) => {
    setDefaultId(id);
  };

  const handleSave = () => {
    Alert.alert('Saved!', 'Your default payment preference has been updated.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            We don't require credit cards! Select how you usually prefer to pay for your laundry. This will be selected by default at checkout.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Methods</Text>
          
          {PAYMENT_PREFERENCES.map((method) => {
            const isSelected = defaultId === method.id;
            return (
              <TouchableOpacity 
                key={method.id} 
                style={[
                  styles.paymentCard, 
                  isSelected && { borderColor: method.borderColor, backgroundColor: '#FFF' }
                ]}
                activeOpacity={0.7}
                onPress={() => handleSetDefault(method.id)}
              >
                <View style={[styles.iconBox, { backgroundColor: method.bgColor }]}>
                  {method.icon}
                </View>
                
                <View style={styles.cardDetails}>
                  <Text style={styles.cardTitle}>{method.title}</Text>
                  <Text style={styles.cardSub}>{method.sub}</Text>
                </View>

                <View style={styles.radioContainer}>
                  {isSelected ? (
                    <CheckCircle2 size={24} color={method.borderColor} />
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Preference</Text>
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
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoText: {
    color: '#1E3A8A',
    fontSize: 14,
    lineHeight: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
  },
  radioContainer: {
    marginLeft: 12,
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
  saveBtn: {
    backgroundColor: '#1C158A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C158A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
