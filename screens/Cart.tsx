import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Camera, AlertCircle } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import * as ImagePicker from 'expo-image-picker';
import { analyzeClothingTag } from '../utils/groqApi';

export default function CartScreen({ navigation }: any) {
  const { items, subTotal, total, removeItem } = useCart();
  const pickupDelivery = items.length > 0 ? 40 : 0;
  
  const [scanning, setScanning] = useState(false);
  const [specialCare, setSpecialCare] = useState<string | null>(null);

  const handleScanTag = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Camera permission is required to scan tags.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        base64: true,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        setScanning(true);
        const analysis = await analyzeClothingTag(result.assets[0].base64);
        if (analysis) {
          setSpecialCare(analysis);
        } else {
          alert("Could not analyze the tag. Please try again.");
        }
      }
    } catch (e) {
      console.log("Error scanning tag:", e);
    } finally {
      setScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <Text style={styles.headerSubtitle}>Review your items</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Your cart is empty.</Text>
          </View>
        ) : (
          <>
            {/* AI Scanner Banner */}
            <TouchableOpacity 
              style={styles.scanBanner}
              onPress={handleScanTag}
              activeOpacity={0.8}
            >
              <View style={styles.scanIconBox}>
                <Camera size={24} color="#FFF" />
              </View>
              <View style={styles.scanDetails}>
                <Text style={styles.scanTitle}>AI Fabric Scanner</Text>
                <Text style={styles.scanSub}>Scan your clothing tag for special care</Text>
              </View>
              {scanning && <ActivityIndicator color="#1C158A" />}
            </TouchableOpacity>

            {specialCare && (
              <View style={styles.specialCareBox}>
                <AlertCircle size={20} color="#EAB308" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.specialCareTitle}>AI Care Instructions Added:</Text>
                  <Text style={styles.specialCareText}>{specialCare}</Text>
                </View>
              </View>
            )}

            {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Text style={styles.emojiIcon}>{item.icon}</Text>
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubDetail}>Service: {item.serviceType}</Text>
                <Text style={styles.itemSubDetail}>
                  ₹ {item.price}   <Text style={styles.qtyText}>Qty:{item.qty}</Text>
                </Text>
              </View>

              <View style={styles.itemActions}>
                <Text style={styles.itemTotal}>₹ {item.price * item.qty}</Text>
                <TouchableOpacity style={styles.trashBtn} onPress={() => removeItem(item.id, item.serviceType)}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub Total</Text>
          <Text style={styles.summaryValue}>₹ {subTotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pickup & Delivery</Text>
          <Text style={styles.summaryValue}>₹ {pickupDelivery}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹ {total}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.proceedBtn, items.length === 0 && { opacity: 0.5 }]}
          onPress={() => items.length > 0 && navigation.navigate('SelectAddress', { specialInstructions: specialCare })}
          disabled={items.length === 0}
        >
          <Text style={styles.proceedText}>Proceed</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiIcon: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  itemSubDetail: {
    fontSize: 14,
    color: '#444',
  },
  qtyText: {
    fontSize: 12,
    color: '#888',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  trashBtn: {
    padding: 4,
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
  totalRow: {
    marginTop: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  proceedBtn: {
    backgroundColor: '#000080',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 16,
  },
  scanIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C158A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scanDetails: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C158A',
    marginBottom: 4,
  },
  scanSub: {
    fontSize: 13,
    color: '#4F46E5',
  },
  specialCareBox: {
    flexDirection: 'row',
    backgroundColor: '#FEFCE8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginBottom: 16,
    gap: 12,
  },
  specialCareTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A16207',
    marginBottom: 4,
  },
  specialCareText: {
    fontSize: 13,
    color: '#713F12',
    lineHeight: 20,
    fontWeight: '600',
  },
});
