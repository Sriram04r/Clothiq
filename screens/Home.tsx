import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, ClipboardList, Bell, LayoutGrid, User } from 'lucide-react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, onSnapshot, where } from '@react-native-firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState('App User');
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) saveTokenToFirebase(token);
    });
    
    const user = getAuth().currentUser;
    let unsubscribeOrder: any;

    const fetchUser = async () => {
      if (user) {
        setUserName(user.displayName || 'App User');
        try {
          const docSnap = await getDoc(doc(getFirestore(), 'users', user.uid));
          if (docSnap.exists() && docSnap.data().fullName) {
            setUserName(docSnap.data().fullName);
          }
        } catch(e) {}
      }
    };
    
    fetchUser();

    if (user) {
      const q = query(
        collection(getFirestore(), 'users', user.uid, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      unsubscribeOrder = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          // Find the most recent order that is NOT delivered
          const activeDoc = snapshot.docs.find(doc => doc.data().status !== 'delivered');
          if (activeDoc) {
            setActiveOrder({ id: activeDoc.id, ...activeDoc.data() });
          } else {
            setActiveOrder(null);
          }
        } else {
          setActiveOrder(null);
        }
      });
    }

    return () => {
      if (unsubscribeOrder) unsubscribeOrder();
    };
  }, []);

  const saveTokenToFirebase = async (token: string) => {
    const user = getAuth().currentUser;
    if (user) {
      await setDoc(doc(getFirestore(), 'users', user.uid), { pushToken: token }, { merge: true });
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'clothiq-id' // Generic fallback since we aren't using EAS yet
      })).data;
    } 
    return token;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userName.split(' ')[0]}</Text>
            <Text style={styles.subGreeting}>Let's get your laundry done!</Text>
          </View>
          <View style={styles.profileAvatar}>
            <User size={24} color="#2945FF" />
          </View>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>20% OFF</Text>
            <Text style={styles.bannerText}>On your first order</Text>
            <View style={styles.promoCodeContainer}>
              <Text style={styles.promoCode}>Use Code: FRESH20</Text>
            </View>
          </View>
          <View style={styles.bannerImage}>
            <Text style={styles.bannerEmoji}>🧺</Text>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.servicesGrid}>
            <TouchableOpacity style={[styles.serviceCard, { backgroundColor: '#FFF5FA' }]} onPress={() => navigation.navigate('Services')} activeOpacity={0.7}>
              <Image source={require('../assets/Wash_Fold.png')} style={styles.serviceImage} resizeMode="contain" />
              <Text style={styles.serviceName}>Wash & Fold</Text>
              <Text style={styles.servicePrice}>From ₹1O/PC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.serviceCard, { backgroundColor: '#F0FDF4' }]} onPress={() => navigation.navigate('Services')} activeOpacity={0.7}>
              <Image source={require('../assets/Dry_cleaning.png')} style={styles.serviceImage} resizeMode="contain" />
              <Text style={styles.serviceName}>Dry Cleaning</Text>
              <Text style={styles.servicePrice}>From ₹100/pc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.serviceCard, { backgroundColor: '#EFF6FF' }]} onPress={() => navigation.navigate('Services')} activeOpacity={0.7}>
              <Image source={require('../assets/Steam_Iron.png')} style={styles.serviceImage} resizeMode="contain" />
              <Text style={styles.serviceName}>Steam Iron</Text>
              <Text style={styles.servicePrice}>From ₹15/pc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.serviceCard, { backgroundColor: '#F5F5F5' }]} onPress={() => navigation.navigate('Services')} activeOpacity={0.7}>
              <Image source={require('../assets/Wash_Iron.png')} style={styles.serviceImage} resizeMode="contain" />
              <Text style={styles.serviceName}>Wash & Iron</Text>
              <Text style={styles.servicePrice}>From ₹30/kg</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Orders Section */}
        {activeOrder && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Orders</Text>
            </View>

            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderStatusIcon}>
                  <View style={styles.statusDot} />
                </View>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.orderId}>Order #FW{activeOrder.id.substring(0,6).toUpperCase()}</Text>
                  <Text style={styles.orderStatus}>
                    {activeOrder.status === 'placed' || activeOrder.status === 'placed_cod' ? 'Order Placed' :
                     activeOrder.status === 'pickup' ? 'Ready for Pickup' :
                     activeOrder.status === 'washing' ? 'Washing in progress' :
                     activeOrder.status === 'out_for_delivery' ? 'Out for Delivery' : 
                     'In Progress'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.trackButton}
                  onPress={() => navigation.navigate('TrackOrder', { orderId: activeOrder.id })}
                >
                  <Text style={styles.trackLink}>Track</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.deliveryDate}>
                  Items: {activeOrder.itemsCount}  |  Total: ₹{activeOrder.pricing?.total || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#2945FF" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderHistory')}>
          <ClipboardList size={24} color="#8e8e93" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#8e8e93',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  banner: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2945FF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#111111',
    marginBottom: 12,
  },
  promoCodeContainer: {
    backgroundColor: 'rgba(41, 69, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoCode: {
    color: '#2945FF',
    fontSize: 12,
    fontWeight: '600',
  },
  bannerImage: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 64,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2945FF',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceImage: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 12,
    color: '#8e8e93',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderStatusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111111',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  orderStatus: {
    fontSize: 12,
    color: '#8e8e93',
  },
  trackButton: {
    marginLeft: 'auto',
  },
  trackLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2945FF',
  },
  orderFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  deliveryDate: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '500',
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
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
    color: '#2945FF',
  },
});
