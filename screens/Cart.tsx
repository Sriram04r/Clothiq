import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const getItemImage = (name: string) => {
  const n = name.toLowerCase();
  
  // Custom generated high-quality assets
  if (n.includes('lehanga') || n.includes('lehenga')) return require('../assets/items/lehenga.png');
  if (n.includes('chudidhar') || n.includes('chudidar')) return require('../assets/items/chudidhar.png');
  if (n.includes('frock') || n.includes('ladies frock')) return require('../assets/items/frock.png');
  if (n.includes('blanket')) return require('../assets/items/blanket.png');
  if (n.includes('pair') || (n.includes('white') && (n.includes('pant') || n.includes('shirt')))) return require('../assets/items/white_shirt_pant.png');

  // Fallbacks to generic icons
  if (n.includes('skirt')) return { uri: 'https://img.icons8.com/color/96/skirt.png' };
  if (n.includes('kurta')) return { uri: 'https://img.icons8.com/color/96/clothes.png' };
  if (n.includes('saree') || n.includes('sari')) return { uri: 'https://img.icons8.com/color/96/saree.png' };
  if (n.includes('dress')) return { uri: 'https://img.icons8.com/color/96/clothes.png' };
  
  if (n.includes('jubba') || n.includes('kid') || n.includes('baby')) return { uri: 'https://img.icons8.com/color/96/onesie.png' };
  if (n.includes('toy')) return { uri: 'https://img.icons8.com/color/96/teddy-bear.png' };

  if (n.includes('jean')) return { uri: 'https://img.icons8.com/color/96/jeans.png' };
  if (n.includes('pant') || n.includes('trouser')) return { uri: 'https://img.icons8.com/color/96/trousers.png' };
  if (n.includes('t-shirt') || n.includes('shirt') || n.includes('top')) return { uri: 'https://img.icons8.com/color/96/shirt.png' };
  if (n.includes('suit') || n.includes('tie') || n.includes('blazer')) return { uri: 'https://img.icons8.com/color/96/tie.png' };
  
  if (n.includes('towel')) return { uri: 'https://img.icons8.com/color/96/towel.png' };
  if (n.includes('pillow')) return { uri: 'https://img.icons8.com/color/96/pillow.png' };
  if (n.includes('bed') || n.includes('cover')) return { uri: 'https://img.icons8.com/color/96/bed.png' };
  if (n.includes('shoe') || n.includes('sneaker')) return { uri: 'https://img.icons8.com/color/96/shoes.png' };
  if (n.includes('jacket') || n.includes('coat') || n.includes('hoodie')) return { uri: 'https://img.icons8.com/color/96/jacket.png' };
  if (n.includes('sock')) return { uri: 'https://img.icons8.com/color/96/socks.png' };
  
  return { uri: 'https://img.icons8.com/color/96/clothes.png' };
};

export default function CartScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { items, subTotal, total, removeItem } = useCart();
  const pickupDelivery = items.length > 0 ? 40 : 0;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('cart')}</Text>
          <Text style={styles.headerSubtitle}>{t('reviewItems')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>{t('emptyCart')}</Text>
          </View>
        ) : (
          <>
            {items.map((item) => (
            <View key={`${item.id}-${item.serviceType}`} style={styles.itemCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.color || '#F0F9FF', padding: 8 }]}>
                <Image source={getItemImage(item.name)} style={{ width: 40, height: 40 }} resizeMode="contain" />
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubDetail}>{t('service')}: {item.serviceType}</Text>
                <Text style={styles.itemSubDetail}>
                  ₹ {item.price}   <Text style={styles.qtyText}>{t('qty')}:{item.qty}</Text>
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
          <Text style={styles.summaryLabel}>{t('subTotal')}</Text>
          <Text style={styles.summaryValue}>₹ {subTotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('pickupDelivery')}</Text>
          <Text style={styles.summaryValue}>₹ {pickupDelivery}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>{t('total')}</Text>
          <Text style={styles.totalValue}>₹ {total}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.proceedBtn, items.length === 0 && { opacity: 0.5 }]}
          onPress={() => items.length > 0 && navigation.navigate('SelectAddress')}
          disabled={items.length === 0}
        >
          <Text style={styles.proceedText}>{t('proceed')}</Text>
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
