import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Truck, MapPin, ReceiptText } from 'lucide-react-native';

export default function OrderDetailsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Order Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.orderIdText}>Order ID: FW123456</Text>
        
        <Text style={styles.sectionTitle}>Order Items</Text>
        
        <View style={styles.receiptContainer}>
          
          <View style={styles.receiptItem}>
            <View style={styles.receiptLeft}>
              <View style={styles.receiptIconBox}>
                <ReceiptText size={20} color="#111" />
              </View>
              <View>
                <Text style={styles.itemTitle}>5 items</Text>
                <Text style={styles.itemSubtitle}>Wash & Fold</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>₹688</Text>
          </View>

          <View style={styles.receiptItem}>
            <View style={styles.receiptLeft}>
              <View style={styles.receiptIconBox}>
                <Truck size={20} color="#111" />
              </View>
              <View>
                <Text style={styles.itemTitle}>Pickup & Delivery</Text>
                <Text style={styles.itemSubtitle}>17 May 2025, 10:15 AM</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>₹40</Text>
          </View>

          <View style={styles.receiptItemRow}>
            <Text style={styles.receiptRowLabel}>Coupon Discount (FRESH20)</Text>
            <Text style={styles.receiptRowValueRed}>- ₹30</Text>
          </View>

          <View style={styles.receiptItemRow}>
            <Text style={styles.receiptRowLabel}>GST (5%)</Text>
            <Text style={styles.receiptRowValue}>₹18</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹716</Text>
          </View>
          
        </View>

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        
        <View style={styles.addressCard}>
          <MapPin size={24} color="#1C158A" style={styles.addressIcon} />
          <View>
            <Text style={styles.addressTitle}>Home</Text>
            <Text style={styles.addressText}>Sri KrishnaDevaraya Nagar</Text>
            <Text style={styles.addressText}>Kothapeta-533223</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.invoiceBtn}>
          <Text style={styles.invoiceBtnText}>Download Invoice</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.trackBtn}
          onPress={() => navigation.navigate('TrackOrder')}
        >
          <Text style={styles.trackBtnText}>Track Order</Text>
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
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  receiptContainer: {
    marginBottom: 32,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  receiptRowLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  receiptRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  receiptRowValueRed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  addressCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE4E6', // Light pink border
    borderRadius: 12,
    backgroundColor: '#FFFBFC', // Very slight pink tint matching design
    alignItems: 'center',
  },
  addressIcon: {
    marginRight: 12,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    gap: 16,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  invoiceBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1C158A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceBtnText: {
    color: '#1C158A',
    fontSize: 14,
    fontWeight: '600',
  },
  trackBtn: {
    flex: 1,
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
