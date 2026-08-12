import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Clock, Truck, ShieldCheck, Check } from 'lucide-react-native';

export default function ServiceDetailsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={24} color="#EF4444" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/Service_details.png')}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Title and Price Row */}
        <View style={styles.titleRow}>
          <Text style={styles.serviceTitle}>Wash & Fold</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹120 / kg</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>4.7 <Text style={styles.ratingCount}>(256)</Text></Text>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <Clock size={24} color="#1C158A" style={styles.featureIcon} />
            <Text style={styles.featureText}>24 Hours{'\n'}Delivery</Text>
          </View>
          <View style={styles.featureCard}>
            <Truck size={24} color="#111" style={styles.featureIcon} />
            <Text style={styles.featureText}>Free Pickup{'\n'}& Delivery</Text>
          </View>
          <View style={styles.featureCard}>
            <ShieldCheck size={24} color="#1C158A" style={styles.featureIcon} />
            <Text style={styles.featureText}>Quality{'\n'}Assured</Text>
          </View>
        </View>

        {/* Service Includes Checklist */}
        <Text style={styles.sectionTitle}>Service Includes</Text>
        <View style={styles.checklistContainer}>

          <View style={styles.checkItem}>
            <Check size={18} color="#111" style={styles.checkIcon} />
            <Text style={styles.checkText}>Washing & Drying</Text>
          </View>

          <View style={styles.checkItem}>
            <Check size={18} color="#111" style={styles.checkIcon} />
            <Text style={styles.checkText}>Folding & Packing</Text>
          </View>

          <View style={styles.checkItem}>
            <Check size={18} color="#111" style={styles.checkIcon} />
            <Text style={styles.checkText}>Premium Detergent</Text>
          </View>

          <View style={styles.checkItem}>
            <Check size={18} color="#111" style={styles.checkIcon} />
            <Text style={styles.checkText}>Quality Check</Text>
          </View>

        </View>

      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('SelectItems')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  favoriteButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  mainImage: {
    width: 250,
    height: 200,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C158A', // Deep blue
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  ratingCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 40,
  },
  featureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureText: {
    fontSize: 11,
    color: '#111',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  checklistContainer: {
    gap: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 12,
  },
  checkText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '400',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  continueBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
