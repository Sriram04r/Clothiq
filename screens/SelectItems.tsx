import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Minus } from 'lucide-react-native';
import { useCart } from '../context/CartContext';

const itemsData = [
  // General / Men
  { id: '1', name: 'Pant', price: 10, icon: '👖', color: '#EEF2FF' },
  { id: '2', name: 'Shirt', price: 10, icon: '👕', color: '#F0F9FF' },
  { id: '3', name: 'White-Liquid Pair', price: 30, icon: '👔', color: '#ECFDF5' },
  
  // Ladies
  { id: '4', name: 'Saree (Normal)', price: 30, icon: '🥻', color: '#FDF2F8' },
  { id: '5', name: 'Saree (Pattu/Silk)', price: 45, icon: '🥻', color: '#FFF1F2' },
  { id: '6', name: 'Chudidhar (Pair)', price: 10, icon: '👗', color: '#FDF4FF' },
  { id: '7', name: 'Lehanga (Pair)', price: 10, icon: '👗', color: '#FAF5FF' },
  { id: '8', name: 'Frock', price: 15, icon: '👗', color: '#F5F3FF' },
  
  // Kids
  { id: '9', name: 'Kids Item (Single)', price: 5, icon: '🧸', color: '#FFFBEB' },
  
  // Household
  { id: '10', name: 'Towel', price: 5, icon: '🧻', color: '#F8FAFC' },
  { id: '11', name: 'Blanket', price: 80, icon: '🛏️', color: '#F7FEE7' },
];

export default function SelectItemsScreen({ navigation }: any) {
  const { updateQuantityOrAdd, getItemQuantity, subTotal } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select Items</Text>
          <Text style={styles.headerSubtitle}>Choose your items and add quantity</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {itemsData.map((item) => {
          const qty = getItemQuantity(item.id);
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Text style={styles.emojiIcon}>{item.icon}</Text>
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹ {item.price}</Text>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityBtn} onPress={() => updateQuantityOrAdd(item, -1)}>
                  <Minus size={16} color="#111" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{qty}</Text>
                <TouchableOpacity style={styles.quantityBtn} onPress={() => updateQuantityOrAdd(item, 1)}>
                  <Plus size={16} color="#111" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Sticky Bottom Cart Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>Total: ₹{subTotal}</Text>
        <TouchableOpacity
          style={styles.viewCartBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
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
    paddingBottom: 100, // padding for bottom bar
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
  itemPrice: {
    fontSize: 14,
    color: '#444',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  quantityBtn: {
    padding: 8,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    width: 24,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#000080', // Dark blue from screenshot
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  viewCartBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000080',
  },
});
