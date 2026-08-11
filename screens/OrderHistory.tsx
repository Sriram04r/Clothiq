import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Gift, Shirt, XCircle, Truck, Package } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot } from '@react-native-firebase/firestore';

export default function OrderHistoryScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const q = query(
      collection(db, 'users', user.uid, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    
    const status = order.status || '';
    if (activeTab === 'Completed') {
      return status === 'delivered';
    } else if (activeTab === 'In Progress') {
      return status !== 'delivered' && status !== 'cancelled';
    } else if (activeTab === 'Cancelled') {
      return status === 'cancelled';
    }
    return true;
  });

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'pending_payment': return 'Pending Payment';
      case 'paid': return 'Paid (Pending Pickup)';
      case 'placed_cod': return 'Placed (COD)';
      case 'washing': return 'Washing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'In Progress';
    }
  };

  const renderIcon = (status: string) => {
    if (status === 'delivered') {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
          <Gift size={24} color="#10B981" />
        </View>
      );
    } else if (status === 'cancelled') {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
          <XCircle size={24} color="#EF4444" />
        </View>
      );
    } else if (status === 'washing' || status === 'paid' || status === 'placed_cod') {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
          <Shirt size={24} color="#6366F1" />
        </View>
      );
    } else {
      return (
        <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
          <Truck size={24} color="#F59E0B" />
        </View>
      );
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'delivered') return '#10B981'; // Green
    if (status === 'cancelled') return '#EF4444'; // Red
    return '#3B82F6'; // Blue for all in-progress states
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown Date';
    // Firestore timestamp extraction
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

      {loading ? (
        <ActivityIndicator size="large" color="#1C158A" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {filteredOrders.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Package size={48} color="#D1D5DB" />
              <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280', fontWeight: '500' }}>No orders found.</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <TouchableOpacity 
                key={order.id} 
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                activeOpacity={0.7}
              >
                {renderIcon(order.status)}
                
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>Order #FW{order.id.substring(0, 6).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                  <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{getStatusDisplay(order.status)}</Text>
                </View>
                
                <Text style={styles.orderPrice}>₹{order.pricing?.total || 0}</Text>
              </TouchableOpacity>
            ))
          )}

        </ScrollView>
      )}
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
