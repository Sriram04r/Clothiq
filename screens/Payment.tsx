import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Circle } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const paymentMethods = [
  { id: 'phonepe', title: 'PhonePe', sub: 'Pay using PhonePe', localImage: require('../assets/Phonepay.png') },
  { id: 'gpay', title: 'Google Pay', sub: 'Pay using Google Pay', icon: 'G', imageUrl: 'https://img.icons8.com/color/48/000000/google-pay-india.png' },
  { id: 'paytm', title: 'Paytm', sub: 'Pay using Paytm', icon: 'T', imageUrl: 'https://img.icons8.com/color/48/000000/paytm.png' },
  { id: 'navi', title: 'Navi', sub: 'Pay using Navi', localImage: require('../assets/Navi.png') },
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay when you receive', icon: 'C', imageUrl: 'https://img.icons8.com/color/48/000000/cash-in-hand.jpg' },
];

export default function PaymentScreen({ route, navigation }: any) {
  const { t } = useTranslation();
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
        const upiId = '9014428656@axl';
        const queryParams = `pa=${upiId}&pn=Clothiq&tn=Order_${orderId}&am=${amount || 688}&cu=INR`;
        
        let specificUrl = `upi://pay?${queryParams}`;
        if (selectedMethod === 'gpay') {
          specificUrl = `tez://upi/pay?${queryParams}`;
        } else if (selectedMethod === 'phonepe') {
          specificUrl = `phonepe://pay?${queryParams}`;
        } else if (selectedMethod === 'paytm') {
          specificUrl = `paytmmp://pay?${queryParams}`;
        }

        try {
          await Linking.openURL(specificUrl);
          await new Promise(resolve => setTimeout(resolve, 3500));
        } catch (e) {
          console.log(`Failed to open specific app (${specificUrl}), falling back to generic upi://`);
          try {
            const fallbackUrl = `upi://pay?${queryParams}`;
            await Linking.openURL(fallbackUrl);
            await new Promise(resolve => setTimeout(resolve, 3500));
          } catch (fallbackErr) {
            console.log("UPI Intent error:", fallbackErr);
            Alert.alert("Test Mode", "Could not open UPI app. Simulating successful payment.");
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }
      // ----------------------------

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const orderRef = doc(db, 'users', user.uid, 'orders', orderId);
      
      const newStatus = selectedMethod === 'cod' ? 'placed_cod' : 'paid';
      
      await updateDoc(orderRef, {
        status: newStatus,
        paymentMethod: selectedMethod
      });

      clearCart();

      // Notify Admins
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        const tokens: string[] = [];
        querySnapshot.forEach((d) => {
          if (d.data().pushToken) {
            tokens.push(d.data().pushToken);
          }
        });

        if (tokens.length > 0) {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokens.map(t => ({
              to: t,
              sound: 'default',
              title: '🚨 New Order Received!',
              body: `An order for ₹${amount || 0} has been placed.`,
              data: { orderId: orderId },
            }))),
          });
        }
      } catch (e) {
        console.log("Failed to notify admin:", e);
      }

      navigation.navigate('OrderConfirmation', { orderId });
      
      const displayOrderId = `FW${orderId.substring(0, 6).toUpperCase()}`;
      
      // WhatsApp Notification Trigger
      try {
        const message = `Hi Clothiq Admin! I just placed a new laundry order!\n\nOrder ID: #${displayOrderId}\nTotal Amount: ₹${amount || 0}\n\nPlease process my pickup as soon as possible!`;
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}&phone=+919666394628`;
        Linking.openURL(whatsappUrl).catch(e => console.log("WhatsApp not installed"));
      } catch (e) {
        console.log("Failed to open WhatsApp:", e);
      }

      // EmailJS Silent Background Email
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'service_ej24ril',
            template_id: 'template_74gpi5q',
            user_id: 'Apdqkx0-ma2xXUS5S',
            template_params: {
              order_id: displayOrderId,
              amount: amount || 0,
            }
          })
        });
        const responseText = await response.text();
        console.log("EmailJS Response:", response.status, responseText);
      } catch (e) {
        console.log("Silent Email failed:", e);
      }
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
          <Text style={styles.headerTitle}>{t('payment')}</Text>
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
                <Text style={styles.title}>{t(method.title, method.title)}</Text>
                <Text style={styles.subtitle}>{t(method.sub, method.sub)}</Text>
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
          <Text style={styles.totalLabel}>{t('totalPayable', 'Total Payable')}</Text>
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
            <Text style={styles.payText}>{t('payNow')}</Text>
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
