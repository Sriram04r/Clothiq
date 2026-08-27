import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Minus } from 'lucide-react-native';
import { useCart } from '../context/CartContext';

const itemsData = [
  // General / Men
  { id: '1', name: 'Pant', price: 10, icon: '👖', color: '#EEF2FF', category: 'Men' },
  { id: '2', name: 'Shirt', price: 10, icon: '👕', color: '#F0F9FF', category: 'Men' },
  { id: '3', name: 'White-Liquid Pair', price: 30, icon: '👔', color: '#ECFDF5', category: 'Men' },
  
  // Ladies
  { id: '4', name: 'Saree (Normal)', price: 30, icon: '🥻', color: '#FDF2F8', category: 'Women' },
  { id: '5', name: 'Saree (Pattu/Silk)', price: 45, icon: '🥻', color: '#FFF1F2', category: 'Women' },
  { id: '6', name: 'Chudidhar (Pair)', price: 10, icon: '👗', color: '#FDF4FF', category: 'Women' },
  { id: '7', name: 'Lehanga (Pair)', price: 10, icon: '👗', color: '#FAF5FF', category: 'Women' },
  { id: '8', name: 'Frock', price: 15, icon: '👗', color: '#F5F3FF', category: 'Women' },
  
  // Kids
  { id: '9', name: 'Kids Item (Single)', price: 5, icon: '🧸', color: '#FFFBEB', category: 'Kids' },
  
  // Household
  { id: '10', name: 'Towel', price: 5, icon: '🧻', color: '#F8FAFC', category: 'Household' },
  { id: '11', name: 'Blanket', price: 80, icon: '🛏️', color: '#F7FEE7', category: 'Household' },
];

const categories = ['Men', 'Women', 'Kids', 'Household'];

export default function SelectItemsScreen({ navigation }: any) {
  const { updateQuantityOrAdd, getItemQuantity, subTotal } = useCart();
  const [activeCategory, setActiveCategory] = useState('Men');

  const filteredItems = itemsData.filter(item => item.category === activeCategory);

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

      {/* Category Tabs */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                activeCategory === category && styles.categoryTabActive
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => {
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
        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items found in this category.</Text>
          </View>
        )}
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
    paddingBottom: 10,
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
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  categoryTabActive: {
    backgroundColor: '#000080',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 14,
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
