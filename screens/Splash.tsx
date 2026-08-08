import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.logoSection}>
          <Image source={require('../assets/splashscreen1.png')} style={styles.logoIcon} resizeMode="contain" />
          <Text style={styles.title}>FreshWash</Text>
          <Text style={styles.subtitle}>Laundry at your Doorstep</Text>
        </View>
        
        <View style={styles.illustration}>
          <Image source={require('../assets/splashscreen.png')} style={styles.mainImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
  illustration: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  mainImage: {
    width: 250,
    height: 250,
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 24,
  },
  button: {
    backgroundColor: '#2945FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
