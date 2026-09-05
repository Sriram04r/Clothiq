import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Home, ClipboardList, Bell, LayoutGrid, User, Clock, CheckCircle2, Gift, Percent, Megaphone } from 'lucide-react-native';

const notifications = [
  {
    group: 'Today',
    data: [
      {
        id: '1',
        title: 'Pickup Scheduled',
        desc: 'Your order #FW123456 pickup is scheduled today between 11:30 AM - 1:00 PM',
        time: '9:30 AM',
        isNew: true,
        iconType: 'clock',
      },
      {
        id: '2',
        title: 'Washing in Progress',
        desc: 'Great! Your clothes are now being washed with care',
        time: '12:45 PM',
        isNew: false,
        iconType: 'washing',
      },
      {
        id: '3',
        title: 'Out for Delivery',
        desc: 'Your order #FW123456 is out for delivery. Our partner will reach you soon!',
        time: '4:20 PM',
        isNew: true,
        iconType: 'truck',
      },
      {
        id: '4',
        title: 'Order Delivered',
        desc: 'Your order #FW123456 has been delivered successfully. Thank you!',
        time: '5:15 PM',
        isNew: true,
        iconType: 'check',
      },
    ]
  },
  {
    group: 'Yesterday',
    data: [
      {
        id: '5',
        title: 'Flat 20% OFF',
        desc: 'Use code FRESH20 and get flat 20% OFF on your next order. Valid till 25 May 2026',
        time: 'Yesterday 10:00 AM',
        isNew: false,
        iconType: 'gift',
      },
      {
        id: '6',
        title: '₹50 Cashback',
        desc: 'Get ₹50 cashback on orders above ₹299. Use code SAVE50.',
        time: 'Yesterday 6:30 PM',
        isNew: true,
        iconType: 'percent',
      },
    ]
  },
  {
    group: 'This week',
    data: [
      {
        id: '7',
        title: 'Free Pickup Weekend',
        desc: 'Enjoy free pickup on all orders this weekend. Limited time offer!',
        time: '18 May 9:00 AM',
        isNew: true,
        iconType: 'megaphone',
      }
    ]
  }
];

export default function NotificationsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');

  const renderIcon = (type: string) => {
    switch (type) {
      case 'clock':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
            <Clock size={20} color="#3B82F6" />
          </View>
        );
      case 'washing':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <LayoutGrid size={20} color="#0284C7" />
          </View>
        );
      case 'truck':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Bell size={20} color="#10B981" /> 
          </View>
        );
      case 'check':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={20} color="#10B981" />
          </View>
        );
      case 'gift':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <Gift size={20} color="#EF4444" />
          </View>
        );
      case 'percent':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FEF9C3' }]}>
            <Percent size={20} color="#EAB308" />
          </View>
        );
      case 'megaphone':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
            <Megaphone size={20} color="#EC4899" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
            <Bell size={20} color="#6B7280" />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {['All', 'Orders', 'Offers'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {notifications.map((group, gIndex) => (
          <View key={gIndex} style={styles.groupContainer}>
            <Text style={styles.groupHeader}>{group.group}</Text>
            
            <View style={styles.groupList}>
              {group.data.map((item, iIndex) => (
                <View key={item.id} style={[styles.notificationCard, iIndex !== group.data.length - 1 && styles.borderBottom]}>
                  {renderIcon(item.iconType)}
                  
                  <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <View style={styles.timeRow}>
                        <Text style={styles.timeText}>{item.time}</Text>
                        {item.isNew && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                    <Text style={styles.notificationDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={24} color="#8e8e93" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderHistory')}>
          <ClipboardList size={24} color="#8e8e93" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Bell size={24} color="#1C158A" />
          <Text style={[styles.navText, styles.navTextActive]}>Notifications</Text>
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 20,
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
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom nav
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  groupList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    flex: 1,
    paddingRight: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginLeft: 6,
  },
  notificationDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
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
    color: '#1C158A',
  },
});
