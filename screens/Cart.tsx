import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }: any) {
  const { items, subTotal, total, removeItem } = useCart();
  const pickupDelivery = items.length > 0 ? 40 : 0;

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
          items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Text style={styles.emojiIcon}>{item.icon}</Text>
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubDetail}>
                  ₹ {item.price}   <Text style={styles.qtyText}>Qty:{item.qty}</Text>
                </Text>
              </View>

              <View style={styles.itemActions}>
                <Text style={styles.itemTotal}>₹ {item.price * item.qty}</Text>
                <TouchableOpacity style={styles.trashBtn} onPress={() => removeItem(item.id)}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))
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
          onPress={() => items.length > 0 && navigation.navigate('SelectAddress')}
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
});
