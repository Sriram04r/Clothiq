import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Shirt, Truck, FastForward, MapPin } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';

export default function OrderSummaryScreen({ route, navigation }: any) {
  const { selectedAddressId, pickupDate, pickupTime, deliveryOption } = route.params || {};

  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Mock cart data (in a real app, this would come from a global store/context)
  const cartSubtotal = 660; 
  const totalItems = 5;
  const couponDiscount = 30;
  
  // Calculate pricing
  const deliveryFee = deliveryOption === 'express' ? 50 : 0;
  const preTaxTotal = cartSubtotal + deliveryFee - couponDiscount;
  const gst = Math.round(preTaxTotal * 0.05);
  const finalTotal = preTaxTotal + gst;

  useEffect(() => {
    const fetchAddress = async () => {
      if (!selectedAddressId) {
        setLoading(false);
        return;
      }
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid, 'addresses', selectedAddressId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAddress({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAddress();
  }, [selectedAddressId]);

  const handlePlaceOrder = async () => {
    try {
      setSavingOrder(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      
      // Save order to Firestore
      const orderData = {
        userId: user.uid,
        status: 'pending_payment',
        shippingAddress: address,
        pickupSchedule: {
          date: pickupDate,
          time: pickupTime,
        },
        deliveryOption,
        pricing: {
          subtotal: cartSubtotal,
          deliveryFee,
          discount: couponDiscount,
          gst,
          total: finalTotal
        },
        itemsCount: totalItems,
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, 'users', user.uid, 'orders'), orderData);
      
      // Navigate to Payment with the new Order ID
      navigation.navigate('Payment', { orderId: orderRef.id, amount: finalTotal });
      
    } catch (error) {
      console.error("Error saving order:", error);
      Alert.alert("Error", "Could not process your order. Please try again.");
    } finally {
      setSavingOrder(false);
    }
  };

  // Format the date for display (assuming pickupDate is an ISO string)
  const displayDate = pickupDate ? new Date(pickupDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Unknown Date';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <Text style={styles.headerSubtitle}>Review your order details</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1C158A" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Billing Details Box */}
          <View style={styles.billingBox}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Cart Subtotal</Text>
              <Text style={styles.billingValue}>₹ {cartSubtotal}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Pickup & Delivery</Text>
              <Text style={styles.billingValue}>{deliveryFee === 0 ? 'FREE' : `₹ ${deliveryFee}`}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Coupon Discount <Text style={styles.couponText}>(FRESH20)</Text></Text>
              <Text style={styles.discountValue}>- ₹ {couponDiscount}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>GST (5%)</Text>
              <Text style={styles.billingValue}>₹ {gst}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.billingRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹ {finalTotal}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Order</Text>

          {/* Order Details Box */}
          <View style={styles.orderBox}>
            
            <View style={styles.orderRow}>
              <View style={styles.iconBox}>
                <Shirt size={20} color="#111" />
              </View>
              <View style={styles.orderTextContainer}>
                <Text style={styles.orderTitle}>{totalItems} Items</Text>
                <Text style={styles.orderSubtitle}>Wash & Fold</Text>
              </View>
            </View>

            <View style={styles.orderRow}>
              <View style={styles.iconBox}>
                <Truck size={20} color="#111" />
              </View>
              <View style={styles.orderTextContainer}>
                <Text style={styles.orderTitle}>Pickup</Text>
                <Text style={styles.orderSubtitle}>{displayDate}, {pickupTime}</Text>
              </View>
            </View>

            <View style={styles.orderRow}>
              <View style={styles.iconBox}>
                <FastForward size={20} color="#111" />
              </View>
              <View style={styles.orderTextContainer}>
                <Text style={styles.orderTitle}>Delivery</Text>
                <Text style={styles.orderSubtitle}>{deliveryOption === 'express' ? 'Express (24 Hours)' : 'Standard (2 Days)'}</Text>
              </View>
            </View>
            
            <View style={[styles.orderRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.iconBox}>
                <MapPin size={20} color="#111" />
              </View>
              <View style={styles.orderTextContainer}>
                <Text style={styles.orderTitle}>Shipping To</Text>
                <Text style={styles.orderSubtitle}>
                  {address ? `${address.type}: ${address.houseNo}, ${address.area}` : 'Address not found'}
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.proceedBtn, savingOrder && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={savingOrder || loading}
        >
          {savingOrder ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.proceedText}>Place Order (₹ {finalTotal})</Text>
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
  },
  billingBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFF0F5',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billingLabel: {
    fontSize: 14,
    color: '#444',
  },
  couponText: {
    color: '#FF3B30',
  },
  billingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  orderBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFF0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  orderSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  proceedBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
