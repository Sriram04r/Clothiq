import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Circle, CheckCircle2 } from 'lucide-react-native';

const dates = [
  { id: '1', label: 'Today', subLabel: '14 May' },
  { id: '2', label: 'Tomorrow', subLabel: '15 May' },
  { id: '3', label: 'Friday', subLabel: '16 May' },
  { id: '4', label: 'Saturday', subLabel: '17 May' },
];

const timeSlots = [
  '9 AM – 11 AM', '11 AM – 1 PM',
  '1 PM – 3 PM', '3 PM – 5 PM',
  '5 PM – 7 PM'
];

export default function PickupDeliveryScreen({ navigation }: any) {
  const [selectedDate, setSelectedDate] = useState('2');
  const [selectedTime, setSelectedTime] = useState('11 AM – 1 PM');
  const [deliveryOption, setDeliveryOption] = useState('standard');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Pickup & Delivery</Text>
          <Text style={styles.headerSubtitle}>Choose your preferred time</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Pickup & Delivery</Text>

        {/* Date Selector */}
        <View style={styles.dateScroll}>
          {dates.map((date) => {
            const isSelected = selectedDate === date.id;
            return (
              <TouchableOpacity
                key={date.id}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDate(date.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateLabel, isSelected && styles.textSelected]}>{date.label}</Text>
                <Text style={[styles.dateSubLabel, isSelected && styles.textSelected]}>{date.subLabel}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time Slot Grid */}
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                onPress={() => setSelectedTime(time)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeText, isSelected && styles.textSelected]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Delivery Option</Text>

        {/* Delivery Options */}
        <TouchableOpacity 
          style={styles.deliveryCard} 
          onPress={() => setDeliveryOption('express')}
          activeOpacity={0.8}
        >
          <View style={styles.radioContainer}>
            {deliveryOption === 'express' ? <CheckCircle2 size={22} color="#111" /> : <Circle size={22} color="#666" />}
          </View>
          <View style={styles.deliveryDetails}>
            <Text style={styles.deliveryTitle}>Express Delivery</Text>
            <Text style={styles.deliverySub}>24 Hours Delivery</Text>
          </View>
          <Text style={styles.deliveryPrice}>₹ 50</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deliveryCard} 
          onPress={() => setDeliveryOption('standard')}
          activeOpacity={0.8}
        >
          <View style={styles.radioContainer}>
            {deliveryOption === 'standard' ? <CheckCircle2 size={22} color="#111" /> : <Circle size={22} color="#666" />}
          </View>
          <View style={styles.deliveryDetails}>
            <Text style={styles.deliveryTitle}>Standard Delivery</Text>
            <Text style={styles.deliverySub}>2 Days Delivery</Text>
          </View>
          <Text style={styles.deliveryFree}>FREE</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => navigation.navigate('OrderSummary')}
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
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginTop: 10,
    marginBottom: 16,
  },
  dateScroll: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  dateCardSelected: {
    backgroundColor: '#1C158A', // Deep blue
    borderColor: '#1C158A',
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  dateSubLabel: {
    fontSize: 11,
    color: '#666',
  },
  textSelected: {
    color: '#FFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  timeSlot: {
    width: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  timeSlotSelected: {
    backgroundColor: '#1C158A',
    borderColor: '#1C158A',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  deliveryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFF0F5',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  radioContainer: {
    marginRight: 16,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  deliverySub: {
    fontSize: 13,
    color: '#333',
  },
  deliveryPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  deliveryFree: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111', // Matches the design
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  continueBtn: {
    backgroundColor: '#1C158A', // Deep blue
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
