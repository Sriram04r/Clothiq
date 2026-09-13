import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Home, ClipboardList, Bell, LayoutGrid, User, MapPin } from 'lucide-react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import * as Location from 'expo-location';
import ChatBotFAB from '../components/ChatBotFAB';

const INITIAL_TIMELINE = [
  { id: '1', title: 'Order Placed', time: '', status: 'pending', key: 'placed' },
  { id: '2', title: 'Pickup Completed', time: '', status: 'pending', key: 'pickup' },
  { id: '3', title: 'Washing in Progress', time: '', status: 'pending', key: 'washing' },
  { id: '4', title: 'Drying & Ironing', time: '', status: 'pending', key: 'drying' },
  { id: '5', title: 'Out for Delivery', time: '', status: 'pending', key: 'out_for_delivery' },
  { id: '6', title: 'Delivered', time: '', status: 'pending', key: 'delivered' },
];

export default function TrackOrderScreen({ route, navigation }: any) {
  const { orderId } = route.params || {};
  const [mapActive, setMapActive] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);

  // Status progression map to determine which steps are done
  const statusHierarchy = ['placed', 'placed_cod', 'paid', 'pickup', 'washing', 'drying', 'out_for_delivery', 'delivered'];
  
  useEffect(() => {
    if (!orderId) return;
    
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const orderRef = doc(db, 'users', user.uid, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder({ id: docSnap.id, ...data });
        
        // Update timeline based on current status
        const currentStatus = data.status || 'placed';
        
        // Map backend status to our simplified timeline keys
        let activeKey = 'placed';
        if (['paid', 'placed_cod', 'pending_payment', 'pickup_ready'].includes(currentStatus)) activeKey = 'placed';
        else if (['pickup', 'out_for_pickup'].includes(currentStatus)) activeKey = 'pickup';
        else if (['washing', 'in_progress'].includes(currentStatus)) activeKey = 'washing';
        else if (['drying', 'ironing'].includes(currentStatus)) activeKey = 'drying';
        else if (['out_for_delivery', 'delivery_ready'].includes(currentStatus)) activeKey = 'out_for_delivery';
        else if (currentStatus === 'delivered') activeKey = 'delivered';
        
        const activeIndex = INITIAL_TIMELINE.findIndex(s => s.key === activeKey);
        
        const updatedTimeline = INITIAL_TIMELINE.map((step, index) => {
          let s = 'pending';
          if (index < activeIndex) s = 'completed';
          else if (index === activeIndex) s = currentStatus === 'delivered' ? 'completed' : 'active';
          
          return { ...step, status: s };
        });
        
        setTimeline(updatedTimeline);
      }
    });
    
    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback to New Delhi if permission denied
        setCustomerLocation({ latitude: 28.6250, longitude: 77.2150 });
        return;
      }
      
      let loc = await Location.getCurrentPositionAsync({});
      setCustomerLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });
    })();
  }, []);

  const getMapRegion = () => {
    if (order?.driverLocation) {
      return {
        latitude: order.driverLocation.latitude,
        longitude: order.driverLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
    }
    if (customerLocation) {
      return {
        ...customerLocation,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
    }
    return {
      latitude: 28.6250,
      longitude: 77.2150,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Track your Order</Text>
          <Text style={styles.headerSubtitle}>Order ID: {orderId ? `FW${orderId.substring(0,6).toUpperCase()}` : 'FW123456'}</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={!mapActive}
      >
        <View style={styles.mapContainer}>
          <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
            <MapPin size={32} color="#9CA3AF" />
            <Text style={{ marginTop: 8, color: '#6B7280', fontSize: 14, fontWeight: '500' }}>Live map is temporarily disabled</Text>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          {timeline.map((step, index) => {
            const isLast = index === timeline.length - 1;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            
            return (
              <View key={step.id} style={styles.timelineRow}>
                {/* Left side: Icon and Line */}
                <View style={styles.iconColumn}>
                  <View style={[
                    styles.node, 
                    isCompleted && styles.nodeCompleted,
                    isActive && styles.nodeActive,
                    step.status === 'pending' && styles.nodePending
                  ]}>
                    {isCompleted && <Check size={14} color="#FFF" strokeWidth={3} />}
                    {isActive && <Check size={14} color="#FFF" strokeWidth={3} />}
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.line, 
                      isCompleted ? styles.lineCompleted : styles.linePending
                    ]} />
                  )}
                </View>
                
                {/* Right side: Content */}
                <View style={styles.contentColumn}>
                  <Text style={[
                    styles.stepTitle, 
                    isActive && styles.stepTitleActive,
                    step.status === 'pending' && styles.stepTitlePending
                  ]}>{step.title}</Text>
                  {step.time ? <Text style={styles.stepTime}>{step.time}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <ChatBotFAB />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={24} color="#8e8e93" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ClipboardList size={24} color="#1C158A" />
          <Text style={[styles.navText, styles.navTextActive]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Bell size={24} color="#8e8e93" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Services')}>
          <LayoutGrid size={24} color="#8e8e93" />
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <User size={24} color="#8e8e93" />
          <Text style={styles.navText}>Profile</Text>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // padding for bottom nav
  },
  mapContainer: {
    height: 250,
    width: '100%',
    backgroundColor: '#EAEAEA',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  map: {
    flex: 1,
  },
  timelineContainer: {
    width: '100%',
  },
  timelineRow: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 20,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: '#34C759', // Green
  },
  nodeActive: {
    backgroundColor: '#1C158A', // Deep Blue
  },
  nodePending: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  line: {
    width: 2,
    height: 44,
    marginVertical: -2,
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: '#34C759',
  },
  linePending: {
    backgroundColor: '#E8E8E8',
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 36,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  stepTitleActive: {
    color: '#1C158A',
  },
  stepTitlePending: {
    color: '#666',
  },
  stepTime: {
    fontSize: 12,
    color: '#888',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8e8e93',
  },
  navTextActive: {
    color: '#1C158A',
  },
});
