import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';

export default function DeliverySuccessScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Delivery illustration from assets */}
        <View style={styles.graphicContainer}>
          <Image source={require('../assets/Delivery.png')} style={styles.illustrationImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Delivered Successfully!</Text>
        <Text style={styles.subtitle}>Your order has been delivered.{'\n'}Hope you loved our service</Text>

        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Delivered On</Text>
          <Text style={styles.dateValue}>17 May 2026, 11:20 AM</Text>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.detailsBtn}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.detailsText}>View Order Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeText}>Back to Home</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  badgeOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7', // Light green
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginBottom: -40,
  },
  badgeInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22C55E', // Green
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: 240,
    height: 180,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  dateBox: {
    backgroundColor: '#E6F4EA', // Light green box
    width: '100%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  dateLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    gap: 16,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  detailsBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  homeText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
});
