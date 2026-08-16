import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collectionGroup, query, where, onSnapshot } from '@react-native-firebase/firestore';
import { getFirestore } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { MapPin, Package, Clock } from 'lucide-react-native';

export default function DriverHomeScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const q = query(
      collectionGroup(db, 'orders'),
      where('driverId', '==', user.uid),
      where('status', 'in', ['pickup_ready', 'out_for_pickup', 'delivery_ready', 'out_for_delivery'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        refPath: doc.ref.path,
        ...doc.data()
      }));
      setTasks(taskList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching driver tasks:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pickup_ready':
      case 'out_for_pickup':
        return '#F59E0B'; // Orange
      case 'delivery_ready':
      case 'out_for_delivery':
        return '#3B82F6'; // Blue
      default:
        return '#8B5CF6'; // Purple
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pickup_ready': return 'Needs Pickup';
      case 'out_for_pickup': return 'Out for Pickup';
      case 'delivery_ready': return 'Needs Delivery';
      case 'out_for_delivery': return 'Out for Delivery';
      default: return 'Active Task';
    }
  };

  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
    >
      <View style={styles.taskHeader}>
        <View style={styles.orderIdContainer}>
          <Package size={16} color="#6B7280" />
          <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={styles.infoRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.addressText} numberOfLines={2}>
            {item.shippingAddress?.houseNo} {item.shippingAddress?.area}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.timeText}>
            {item.pickupSchedule?.date} at {item.pickupSchedule?.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.center}>
          <Package size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No active tasks right now</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: '#4B5563',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
});
