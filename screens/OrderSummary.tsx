import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Shirt, Truck, FastForward } from 'lucide-react-native';

export default function OrderSummaryScreen({ navigation }: any) {
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Billing Details Box */}
        <View style={styles.billingBox}>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Pickup & Delivery</Text>
            <Text style={styles.billingValue}>₹ 40</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Coupon Discount <Text style={styles.couponText}>(FRESH20)</Text></Text>
            <Text style={styles.discountValue}>- ₹ 30</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>GST (5%)</Text>
            <Text style={styles.billingValue}>₹ 18</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.billingRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹ 688</Text>
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
              <Text style={styles.orderTitle}>5 Items</Text>
              <Text style={styles.orderSubtitle}>Wash & Fold</Text>
            </View>
          </View>

          <View style={styles.orderRow}>
            <View style={styles.iconBox}>
              <Truck size={20} color="#111" />
            </View>
            <View style={styles.orderTextContainer}>
              <Text style={styles.orderTitle}>Pickup</Text>
              <Text style={styles.orderSubtitle}>15 May, 11 AM - 1 PM</Text>
            </View>
          </View>

          <View style={[styles.orderRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.iconBox}>
              <FastForward size={20} color="#111" />
            </View>
            <View style={styles.orderTextContainer}>
              <Text style={styles.orderTitle}>Delivery</Text>
              <Text style={styles.orderSubtitle}>Standard (2 Days)</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.proceedBtn}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.proceedText}>Proceed to payment</Text>
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
