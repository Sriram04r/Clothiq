import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Eye, EyeOff, Lock, CheckCircle2, LockKeyhole } from 'lucide-react-native';

export default function ResetPasswordScreen({ navigation }: any) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <Text style={styles.headerSubtitle}>Enter your new password</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <Lock size={18} color="#4B5563" style={styles.lockIcon} />
            <TextInput placeholderTextColor="#9ca3af"
              style={styles.passwordInput}
              placeholder="********"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <Eye size={18} color="#4B5563" /> : <EyeOff size={18} color="#4B5563" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <Lock size={18} color="#4B5563" style={styles.lockIcon} />
            <TextInput placeholderTextColor="#9ca3af"
              style={styles.passwordInput}
              placeholder="********"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <Eye size={18} color="#4B5563" /> : <EyeOff size={18} color="#4B5563" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Rules Checklist */}
        <View style={styles.rulesContainer}>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.ruleText}>At least 8 characters</Text>
          </View>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.ruleText}>One uppercase letter</Text>
          </View>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.ruleText}>One number</Text>
          </View>
          <View style={styles.ruleItem}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.ruleText}>One special character</Text>
          </View>
        </View>

        {/* Placeholder for Lock Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <LockKeyhole size={60} color="#1C158A" />
            {/* Simple CSS rings to mimic the circular arrow graphic */}
            <View style={styles.ring1} />
            <View style={styles.ring2} />
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.resetBtn}
          onPress={() => navigation.navigate('Login')} // Redirect to login on success
        >
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backToLoginLink}
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
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
  },
  lockIcon: {
    marginRight: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
    letterSpacing: 2,
  },
  eyeIcon: {
    padding: 10,
    marginLeft: 8,
  },
  rulesContainer: {
    marginTop: 10,
    marginBottom: 40,
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    fontSize: 13,
    color: '#10B981', // Green text matching checkmark
    fontWeight: '500',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  illustrationPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#EEF2FF', // Very light indigo
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderRadius: 70,
    borderStyle: 'dashed',
  },
  ring2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 80,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    gap: 20,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  resetBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#1C158A',
    fontWeight: '600',
  },
});
