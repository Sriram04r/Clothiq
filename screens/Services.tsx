import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Home, ClipboardList, Bell, User, LayoutGrid, Settings } from 'lucide-react-native';
import ChatBotFAB from '../components/ChatBotFAB';
import { useTranslation } from 'react-i18next';

export default function ServicesScreen({ navigation }: any) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('services')}</Text>
          <Text style={styles.headerSubtitle}>{t('chooseService')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems', { initialService: 'Wash & Fold' })} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF5FA' }]}>
            <Image source={require('../assets/Wash_Fold.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('washAndFold')}</Text>
            <Text style={styles.cardDesc}>{t('washFoldDesc')}</Text>
            <Text style={styles.cardPrice}>{t('from')} ₹ 10/pc</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems', { initialService: 'Dry Cleaning' })} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
            <Image source={require('../assets/Dry_cleaning.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('dryCleaning')}</Text>
            <Text style={styles.cardDesc}>{t('dryCleanDesc')}</Text>
            <Text style={styles.cardPrice}>{t('from')} ₹ 120</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems', { initialService: 'Steam Iron' })} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
            <Image source={require('../assets/Steam_Iron.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('steamIron')}</Text>
            <Text style={styles.cardDesc}>{t('steamIronDesc')}</Text>
            <Text style={styles.cardPrice}>{t('from')} ₹ 20/pc</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems', { initialService: 'Wash & Iron' })} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#F5F5F5' }]}>
            <Image source={require('../assets/Wash_Iron.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('washAndIron')}</Text>
            <Text style={styles.cardDesc}>{t('washIronDesc')}</Text>
            <Text style={styles.cardPrice}>{t('from')} ₹ 60/kg</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>
      </ScrollView>

      <ChatBotFAB />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('home')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderHistory')}>
          <ClipboardList size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('orders')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
          <Bell size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('notifications')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <LayoutGrid size={24} color="#1C158A" />
          <Text style={[styles.navText, styles.navTextActive]}>{t('services')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Settings size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('settings')}</Text>
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
    marginTop: -32, // align with back button
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
    paddingBottom: 100, // Space for bottom nav
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceImage: {
    width: 40,
    height: 40,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A91F6',
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
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  navItem: {
    flex: 1,
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
