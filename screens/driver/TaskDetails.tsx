import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import { MapPin, Phone, Package, Navigation, CheckCircle2, ChevronLeft } from 'lucide-react-native';

export default function TaskDetailsScreen({ route, navigation }: any) {
  const { task } = route.params;
  const [updating, setUpdating] = useState(false);

  const getNextStatusInfo = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pickup_ready':
        return { next: 'out_for_pickup', label: 'Start Pickup Journey', color: '#F59E0B' };
      case 'out_for_pickup':
        return { next: 'in_progress', label: 'Mark as Picked Up', color: '#10B981' };
      case 'delivery_ready':
        return { next: 'out_for_delivery', label: 'Start Delivery Journey', color: '#3B82F6' };
      case 'out_for_delivery':
        return { next: 'delivered', label: 'Mark as Delivered', color: '#10B981' };
      default:
        return null;
    }
  };

  const nextAction = getNextStatusInfo(task.status);

  const handleUpdateStatus = async () => {
    if (!nextAction) return;

    setUpdating(true);
    try {
      const db = getFirestore();
      const orderRef = doc(db, task.refPath);
      await updateDoc(orderRef, {
        status: nextAction.next
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Could not update task status.");
    } finally {
      setUpdating(false);
    }
  };

  const openMaps = () => {
    const address = `${task.shippingAddress?.houseNo}, ${task.shippingAddress?.area}, ${task.shippingAddress?.pincode}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const openDialer = () => {
    if (task.shippingAddress?.phone) {
      Linking.openURL(`tel:${task.shippingAddress.phone}`);
    } else {
      Alert.alert("No Phone", "Customer didn't provide a phone number.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <Package size={20} color="#6B7280" />
            <Text style={styles.infoText}>Order #{task.id.slice(-6).toUpperCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.statusText}>{task.status.replace(/_/g, ' ').toUpperCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Items:</Text>
            <Text style={styles.valueText}>{task.itemsCount || 0} items</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Collection:</Text>
            <Text style={styles.priceText}>₹{task.pricing?.total || 0}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <MapPin size={20} color="#6B7280" />
            <Text style={styles.infoText}>
              {task.shippingAddress?.houseNo}, {task.shippingAddress?.area}{'\n'}
              Pincode: {task.shippingAddress?.pincode}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn} onPress={openMaps}>
              <Navigation size={20} color="#8B5CF6" />
              <Text style={styles.actionBtnText}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={openDialer}>
              <Phone size={20} color="#8B5CF6" />
              <Text style={styles.actionBtnText}>Call Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {nextAction && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: nextAction.color, opacity: updating ? 0.7 : 1 }]}
            onPress={handleUpdateStatus}
            disabled={updating}
          >
            <CheckCircle2 size={24} color="white" />
            <Text style={styles.primaryButtonText}>
              {updating ? 'Updating...' : nextAction.label}
            </Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    width: 120,
  },
  valueText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
