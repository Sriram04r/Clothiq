import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Home, ClipboardList, Bell, User, Sparkles } from 'lucide-react-native';

export default function ServicesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Laundry Services</Text>
          <Text style={styles.headerSubtitle}>Choose a service that fits your needs</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems')} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF5FA' }]}>
            <Image source={require('../assets/Wash_Fold.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Wash & Fold</Text>
            <Text style={styles.cardDesc}>Wash, dry and neatly folded</Text>
            <Text style={styles.cardPrice}>From ₹ 10/pc</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems')} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
            <Image source={require('../assets/Dry_cleaning.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Dry Cleaning</Text>
            <Text style={styles.cardDesc}>Professional care for delicate clothes</Text>
            <Text style={styles.cardPrice}>From ₹ 120</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems')} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
            <Image source={require('../assets/Steam_Iron.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Steam Iron</Text>
            <Text style={styles.cardDesc}>Steam ironing for perfect clothes</Text>
            <Text style={styles.cardPrice}>From ₹ 20/pc</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectItems')} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: '#F5F5F5' }]}>
            <Image source={require('../assets/Wash_Iron.png')} style={styles.serviceImage} resizeMode="contain" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Wash & Iron</Text>
            <Text style={styles.cardDesc}>Wash and iron for everyday wear</Text>
            <Text style={styles.cardPrice}>From ₹ 60/kg</Text>
          </View>
          <ChevronRight size={20} color="#111" />
        </TouchableOpacity>
      </ScrollView>

      {/* Static Bottom Tab Bar matching design */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Home size={24} color="#8e8e93" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('OrderHistory')}>
          <ClipboardList size={24} color="#8e8e93" />
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Notifications')}>
          <Bell size={24} color="#8e8e93" />
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Sparkles size={24} color="#2945FF" />
          <Text style={[styles.tabText, { color: '#2945FF' }]}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <User size={24} color="#8e8e93" />
          <Text style={styles.tabText}>Profile</Text>
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
    paddingBottom: 40,
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: { paddingBottom: 24 },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    color: '#8e8e93',
  },
});
