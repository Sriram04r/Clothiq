import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Gift, Shirt, XCircle } from 'lucide-react-native';

const orders = [
  {
    id: 'FW123456',
    date: '17 May 2025 - 12:10 PM',
    status: 'Delivered',
    price: '₹688',
    iconType: 'gift',
  },
  {
    id: 'FW123455',
    date: '10 May 2025 - 11:30 PM',
    status: 'In Progress',
    price: '₹430',
    iconType: 'shirt',
  },
  {
    id: 'FW123454',
    date: '05 May 2025 - 9:00 AM',
    status: 'Delivered',
    price: '₹199',
    iconType: 'shirt', // Using shirt for both clothes orders
  },
  {
    id: 'FW123453',
    date: '25 May 2025 - 9:39 AM',
    status: 'Cancelled',
    price: '₹127',
    iconType: 'cancel',
  },
];

export default function OrderHistoryScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');

  const renderIcon = (type: string) => {
    switch(type) {
      case 'gift':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
            <Gift size={24} color="#6366F1" />
          </View>
        );
      case 'shirt':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Shirt size={24} color="#10B981" />
          </View>
        );
      case 'cancel':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <XCircle size={24} color="#EF4444" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
            <Shirt size={24} color="#6366F1" />
          </View>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return '#10B981'; // Green
      case 'In Progress': return '#3B82F6'; // Blue
      case 'Cancelled': return '#EF4444'; // Red
      default: return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {['All', 'Completed', 'In Progress', 'Cancelled'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {orders.map((order, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails')}
            activeOpacity={0.7}
          >
            {renderIcon(order.iconType)}
            
            <View style={styles.orderDetails}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
              <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
            
            <Text style={styles.orderPrice}>{order.price}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
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
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#1C158A',
    borderColor: '#1C158A',
  },
  tabText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});
