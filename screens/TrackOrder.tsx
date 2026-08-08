import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Home, ClipboardList, Bell, LayoutGrid, User } from 'lucide-react-native';

const timelineSteps = [
  { id: '1', title: 'Order Placed', time: '15 May, 10:30 AM', status: 'completed' },
  { id: '2', title: 'Pickup Completed', time: '15 May, 11:45 AM', status: 'completed' },
  { id: '3', title: 'Washing in Progress', time: '15 May, 2:30 PM', status: 'active' },
  { id: '4', title: 'Drying', time: '', status: 'pending' },
  { id: '5', title: 'Ironing', time: '', status: 'pending' },
  { id: '6', title: 'Quality Check', time: '', status: 'pending' },
  { id: '7', title: 'Out for Delivery', time: '', status: 'pending' },
  { id: '8', title: 'Delivered', time: '', status: 'pending' },
];

export default function TrackOrderScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Track your Order</Text>
          <Text style={styles.headerSubtitle}>Order ID: FW123456</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineContainer}>
          {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;
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
                <TouchableOpacity 
                  style={styles.contentColumn}
                  onPress={() => {
                    // Hidden shortcut to test delivery page
                    if (isLast) navigation.navigate('DeliverySuccess');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.stepTitle, 
                    isActive && styles.stepTitleActive,
                    step.status === 'pending' && styles.stepTitlePending
                  ]}>{step.title}</Text>
                  {step.time ? <Text style={styles.stepTime}>{step.time}</Text> : null}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

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
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 100,
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
