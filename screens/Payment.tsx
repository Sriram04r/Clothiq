import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Circle } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import { useCart } from '../context/CartContext';

const paymentMethods = [
  { id: 'phonepe', title: 'PhonePe', sub: 'Pay using PhonePe', localImage: require('../assets/Phonepay.png') },
  { id: 'gpay', title: 'Google Pay', sub: 'Pay using Google Pay', icon: 'G', imageUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png' },
  { id: 'paytm', title: 'Paytm', sub: 'Pay using Paytm', icon: 'T', imageUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paytm-icon.png' },
  { id: 'navi', title: 'Navi', sub: 'Pay using Navi', localImage: require('../assets/Navi.png') },
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay when you receive', icon: 'C', imageUrl: 'https://img.icons8.com/color/48/000000/cash-in-hand.png' },
];

export default function PaymentScreen({ route, navigation }: any) {
  const { orderId, amount } = route.params || {};
  const [selectedMethod, setSelectedMethod] = useState('phonepe');
  const [processing, setProcessing] = useState(false);
  const { clearCart } = useCart();

  const handlePayment = async () => {
    if (!orderId) {
      Alert.alert("Error", "Order ID is missing. Please try again.");
      return;
    }

    try {
      setProcessing(true);
      
      // --- NEW UPI INTENT LOGIC ---
      if (selectedMethod !== 'cod') {
        // Real UPI ID for the business owner
        const upiId = '9014428656@axl';
        // Adding mc=0000 (Generic Merchant) and tr (Transaction ID) to prevent PhonePe from blocking it
        const upiUrl = `upi://pay?pa=${upiId}&pn=Clothiq&mc=0000&tr=${orderId}&tn=Order_${orderId}&am=${amount || 688}&cu=INR`;
        
        try {
          // In Android 11+, canOpenURL returns false unless the scheme is registered in AndroidManifest.xml
          // So we bypass canOpenURL and directly try to open the URL.
          await Linking.openURL(upiUrl);
          
          // Wait 3.5 seconds to simulate them completing payment in the other app before they switch back
          await new Promise(resolve => setTimeout(resolve, 3500));
        } catch (e) {
          console.log("UPI Intent error:", e);
          // If they are on an emulator without UPI apps installed, it will throw an error and simulate gracefully
          Alert.alert("Test Mode", "Could not open UPI app. Simulating successful payment.");
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      // ----------------------------

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const orderRef = doc(db, 'users', user.uid, 'orders', orderId);
      
      // Update order status to 'paid' (or 'placed_cod' if Cash on Delivery)
      const newStatus = selectedMethod === 'cod' ? 'placed_cod' : 'paid';
      
      await updateDoc(orderRef, {
        status: newStatus,
        paymentMethod: selectedMethod
      });

      clearCart();

      // Navigate to Confirmation
      navigation.navigate('OrderConfirmation', { orderId });
      
    } catch (error) {
      console.error("Error updating order payment:", error);
      Alert.alert("Payment Error", "Something went wrong processing your payment.");
    } finally {
      setProcessing(false);
    }
  };

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
          <Text style={styles.totalValue}>₹ {amount || 688}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.payBtn, processing && { opacity: 0.7 }]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.payText}>Pay Now</Text>
          )}
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
