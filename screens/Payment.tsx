import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Circle, Smartphone, Landmark, Banknote, CreditCard, BanknoteIcon } from 'lucide-react-native';

const paymentMethods = [
  { id: 'phonepe', title: 'PhonePe', sub: 'Pay using PhonePe', localImage: require('../assets/Phonepay.png') },
  { id: 'gpay', title: 'Google Pay', sub: 'Pay using Google Pay', icon: 'G', imageUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png' },
  { id: 'paytm', title: 'Paytm', sub: 'Pay using Paytm', icon: 'T', imageUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paytm-icon.png' },
  { id: 'navi', title: 'Navi', sub: 'Pay using Navi', localImage: require('../assets/Navi.png') },
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay when you receive', icon: 'C', imageUrl: 'https://img.icons8.com/color/48/000000/cash-in-hand.png' },
];

export default function PaymentScreen({ navigation }: any) {
  const [selectedMethod, setSelectedMethod] = useState('phonepe');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSubtitle}>Choose a payment method</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <TouchableOpacity 
              key={method.id} 
              style={[styles.paymentCard, isSelected && styles.paymentCardSelected]} 
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: isSelected ? '#F0F0FF' : '#FAFAFA' }]}>
                {method.localImage ? (
                  <Image source={method.localImage} style={styles.paymentImage} resizeMode="contain" />
                ) : method.imageUrl ? (
                  <Image source={{ uri: method.imageUrl }} style={styles.paymentImage} resizeMode="contain" />
                ) : method.fallbackIcon ? (
                  <method.fallbackIcon size={24} color={method.color} />
                ) : (
                  <Text style={styles.iconText}>{method.icon}</Text>
                )}
              </View>
              
              <View style={styles.details}>
                <Text style={styles.title}>{method.title}</Text>
                <Text style={styles.subtitle}>{method.sub}</Text>
              </View>

              <View style={styles.radioContainer}>
                {isSelected ? (
                  <View style={styles.radioSelectedInner}>
                    <View style={styles.radioDot} />
                  </View>
                ) : (
                  <Circle size={22} color="#666" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>₹ 688</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => navigation.navigate('OrderConfirmation')}
        >
          <Text style={styles.payText}>Pay Now</Text>
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
    gap: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFF0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentCardSelected: {
    borderColor: '#E8E8E8',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C158A',
  },
  paymentImage: {
    width: 24,
    height: 24,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  radioContainer: {
    marginLeft: 16,
  },
  radioSelectedInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  totalBox: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  payBtn: {
    backgroundColor: '#1C158A',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  payText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
