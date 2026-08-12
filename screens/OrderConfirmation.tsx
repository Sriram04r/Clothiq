import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Truck, Package, Banknote } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

export default function OrderConfirmationScreen({ route, navigation }: any) {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching order confirmation:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1C158A" />
      </SafeAreaView>
    );
  }

  // Derive display values from the order data
  const displayOrderId = order ? `FW${order.id.substring(0, 6).toUpperCase()}` : 'FW123456';
  const phoneNumber = order?.shippingAddress?.phone || 'Unknown';
  
  // Calculate pickup string
  const pickupDateRaw = order?.pickupSchedule?.date;
  const pickupDateStr = pickupDateRaw ? new Date(pickupDateRaw).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown Date';
  const pickupTimeStr = order?.pickupSchedule?.time || 'Unknown Time';

  // Calculate delivery date (Standard = +2 days, Express = +1 day)
  let deliveryDateStr = 'Unknown Date';
  if (pickupDateRaw) {
    const dDate = new Date(pickupDateRaw);
    const daysToAdd = order?.deliveryOption === 'express' ? 1 : 2;
    dDate.setDate(dDate.getDate() + daysToAdd);
    deliveryDateStr = dDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <LottieView
            source={require('../assets/success.json')}
            autoPlay
            loop={false}
            style={{ width: 140, height: 140 }}
          />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Thank you for your order</Text>

        {/* Order ID Box */}
        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>{displayOrderId}</Text>
        </View>

        {/* Timeline Box */}
        <View style={styles.timelineBox}>
          {/* Pickup Item */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconWrapper}>
              <View style={[styles.timelineIcon, { backgroundColor: '#FDF0F6', borderColor: '#FDF0F6' }]}>
                <Truck size={16} color="#FF3B30" />
              </View>
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Pickup</Text>
              <Text style={styles.timelineSub}>{pickupDateStr}, {pickupTimeStr}</Text>
            </View>
          </View>

          {/* Delivery Item */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconWrapper}>
              <View style={[styles.timelineIcon, { backgroundColor: '#FDF0F6', borderColor: '#FDF0F6' }]}>
                <Package size={16} color="#FF3B30" />
              </View>
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Delivery</Text>
              <Text style={styles.timelineSub}>{deliveryDateStr}</Text>
            </View>
          </View>

          {/* Payment Item */}
          <View style={[styles.timelineRow, { paddingBottom: 0 }]}>
            <View style={styles.timelineIconWrapper}>
              <View style={[styles.timelineIcon, { backgroundColor: '#F0FDF4', borderColor: '#F0FDF4' }]}>
                <Banknote size={16} color="#34C759" />
              </View>
            </View>
            <View style={[styles.timelineContent, { paddingBottom: 0 }]}>
              <Text style={styles.timelineTitle}>Payment</Text>
              <Text style={styles.timelineSub}>{order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.smsText}>We have sent the details to your mobile</Text>
        <Text style={styles.phoneText}>{phoneNumber}</Text>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.trackBtn}
          onPress={() => navigation.navigate('TrackOrder')}
        >
          <Text style={styles.trackText}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeText}>Back to Home</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIconBgOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF9C3', // Light yellow
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconBgInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FDE047', // Darker yellow
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 32,
  },
  orderIdBox: {
    backgroundColor: '#F0FDF4', // Light green
    width: '100%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIdLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  orderIdValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  timelineBox: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIconWrapper: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    height: 30, // height of line between items
    backgroundColor: '#E8E8E8',
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24, // spacing below content
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  timelineSub: {
    fontSize: 13,
    color: '#666',
  },
  smsText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    gap: 12,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  trackBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  homeText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
});
