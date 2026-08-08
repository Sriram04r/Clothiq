import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Smartphone, ShieldCheck } from 'lucide-react-native';

export default function OTPVerificationScreen({ navigation }: any) {
  const [otp, setOtp] = useState(['9', '6', '3', '1', '5', '2']); // Default populated as per Figma

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Verify Your Number</Text>
          <Text style={styles.headerSubtitle}>Enter the 6-digit code sent to</Text>
          <Text style={styles.phoneNumber}>+919666394628</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
              onChangeText={(text) => {
                const newOtp = [...otp];
                newOtp[index] = text;
                setOtp(newOtp);
              }}
            />
          ))}
        </View>

        <Text style={styles.resendText}>Resend OTP in 00:25</Text>

        {/* Hand holding Phone illustration from assets */}
        <View style={styles.illustrationContainer}>
          <Image source={require('../assets/Verify_OTP.png')} style={styles.illustrationImage} resizeMode="contain" />
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.verifyBtn}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.verifyText}>Verify OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.changeMobileBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.changeMobileText}>Change Mobile Number</Text>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  phoneNumber: {
    fontSize: 13,
    color: '#111',
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#FFE4E6', // Light pinkish border like Figma
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resendText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  illustrationImage: {
    width: 250,
    height: 180,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    gap: 16,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  verifyBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  changeMobileBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeMobileText: {
    color: '#1C158A',
    fontSize: 14,
    fontWeight: '600',
  },
});
