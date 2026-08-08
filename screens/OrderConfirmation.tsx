import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Truck, Package, Banknote } from 'lucide-react-native';

export default function OrderConfirmationScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconBgOuter}>
            <View style={styles.successIconBgInner}>
              <Check size={40} color="#FFF" strokeWidth={3} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Thank you for your order</Text>

        {/* Order ID Box */}
        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>FW123456</Text>
        </View>

        {/* Timeline Box */}
        <View style={styles.timelineBox}>
          {/* Item 1 */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconWrapper}>
              <View style={[styles.timelineIcon, { backgroundColor: '#FDF0F6', borderColor: '#FDF0F6' }]}>
                <Truck size={16} color="#FF3B30" />
              </View>
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Pickup</Text>
              <Text style={styles.timelineSub}>15 May 2026, 11 AM - 1 PM</Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconWrapper}>
              <View style={[styles.timelineIcon, { backgroundColor: '#FDF0F6', borderColor: '#FDF0F6' }]}>
                <Package size={16} color="#FF3B30" />
              </View>
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Delivery</Text>
              <Text style={styles.timelineSub}>17 May, 2026</Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={[styles.timelineRow, { paddingBottom: 0 }]}>
            <View style={styles.timelineIconWrapper}>
              <View style={[styles.timelineIcon, { backgroundColor: '#F0FDF4', borderColor: '#F0FDF4' }]}>
                <Banknote size={16} color="#34C759" />
              </View>
            </View>
            <View style={[styles.timelineContent, { paddingBottom: 0 }]}>
              <Text style={styles.timelineTitle}>Delivery</Text>
              <Text style={styles.timelineSub}>17 May, 2026</Text>
            </View>
          </View>
        </View>

        <Text style={styles.smsText}>We have sent the details to your mobile</Text>
        <Text style={styles.phoneText}>9666394628</Text>

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
