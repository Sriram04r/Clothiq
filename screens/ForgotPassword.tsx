import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail, ShieldAlert, Lock, User } from 'lucide-react-native';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Email Sent!', 
        'Check your inbox for a secure link to reset your password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Forgot Password?</Text>
          <Text style={styles.headerSubtitle}>
            Don't worry! Enter your registered{'\n'}email address and we'll send you{'\n'}a secure reset link.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.phoneInputContainer}>
            <Mail size={20} color="#6B7280" style={styles.phoneIcon} />
            <TextInput placeholderTextColor="#9ca3af"
              style={styles.phoneInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
            />
          </View>
        </View>

        {/* Forgot Password illustration from assets */}
        <View style={styles.illustrationContainer}>
          <Image source={require('../assets/Forgot_pass.png')} style={styles.illustrationImage} resizeMode="contain" />
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.sendBtn}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.sendText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backToLoginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
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
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginTop: 20,
    marginBottom: 40,
  },
  label: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
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
  sendBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#1C158A',
    fontSize: 14,
    fontWeight: '600',
  },
});
