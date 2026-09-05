import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  // Animation Values
  const logoY = useRef(new Animated.Value(-height)).current; // Starts way above the screen
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current; // Text fade
  const buttonY = useRef(new Animated.Value(100)).current; // Button slide up
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence the animations
    Animated.sequence([
      // 1. Drop and Bounce the Logo
      Animated.parallel([
        Animated.spring(logoY, {
          toValue: 0,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // 2. Fade in the text and slide up the button
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(buttonY, {
          toValue: 0,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Animated.View style={[styles.logoSection, { transform: [{ translateY: logoY }, { scale: logoScale }] }]}>
          <Image source={require('../assets/icon.jpg')} style={styles.mainImage} resizeMode="contain" />
        </Animated.View>
        
        <Animated.View style={[styles.textSection, { opacity: contentOpacity }]}>
          <Text style={styles.title}>Clothiq</Text>
          <Text style={styles.subtitle}>Premium Laundry at your Doorstep</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomSection, { opacity: buttonOpacity, transform: [{ translateY: buttonY }] }]}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
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
    marginBottom: 40,
    shadowColor: '#2945FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  mainImage: {
    width: 200,
    height: 200,
    borderRadius: 40, // Since our generated icons are square, this gives them smooth corners
  },
  textSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
    fontFamily: 'Chewy', // Leveraging the fun font already loaded in App.tsx!
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '500',
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 24,
  },
  button: {
    backgroundColor: '#2945FF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#2945FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
