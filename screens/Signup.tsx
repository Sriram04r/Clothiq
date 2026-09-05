import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { getAuth, createUserWithEmailAndPassword, signOut } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';

export default function SignupScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agreed) {
      Alert.alert('Error', 'Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user in Firebase Auth
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Save their extra details to Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email: email.trim(),
        phone,
        role: email.toLowerCase().includes('driver') ? 'driver' : 'customer',
        createdAt: new Date().toISOString(),
      });
      
      // 3. Immediately sign out so they have to manually log in!
      await signOut(auth);

      Alert.alert('Success', 'Account created! Please log in.');
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
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
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Sign up to get started with FreshWash</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput placeholderTextColor="#9ca3af"
            style={styles.input}
            placeholder="Enter your name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput placeholderTextColor="#9ca3af"
            style={styles.input}
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput placeholderTextColor="#9ca3af"
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput placeholderTextColor="#9ca3af"
              style={styles.passwordInput}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <Eye size={20} color="#9ca3af" /> : <EyeOff size={20} color="#9ca3af" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput placeholderTextColor="#9ca3af"
              style={styles.passwordInput}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <Eye size={20} color="#9ca3af" /> : <EyeOff size={20} color="#9ca3af" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.linkText}>Terms & Conditions</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.createBtn}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.createText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.linkText}>Login</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
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
    marginTop: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#FFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
  },
  eyeIcon: {
    padding: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#1C158A',
    borderColor: '#1C158A',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  linkText: {
    color: '#1C158A',
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  createText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 14,
    color: '#4B5563',
  },
});
