import React, { useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Platform, View, Animated } from 'react-native';
import { Bot } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChatBotFAB() {
  const navigation = useNavigation<any>();
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Play the "jump out" animation
    Animated.sequence([
      // 1. Pull back slightly to wind up
      Animated.timing(translateX, {
        toValue: 5,
        duration: 100,
        useNativeDriver: true,
      }),
      // 2. Spring jump outwards and grow
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -80, // Jump to the left
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.5, // Grow 50% larger
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      // 3. Open the screen!
      navigation.navigate('SupportChat');
      
      // Reset the animation in the background so it's ready when they come back
      setTimeout(() => {
        translateX.setValue(0);
        scale.setValue(1);
      }, 500);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[
        styles.fab, 
        { transform: [{ translateX }, { scale }] }
      ]}>
        <View style={styles.iconContainer}>
          <Bot size={24} color="#FFF" />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0, 
    bottom: Platform.OS === 'ios' ? 120 : 100, 
    width: 50,
    height: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#2945FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4, 
    ...Platform.select({
      ios: {
        shadowColor: '#2945FF',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
    zIndex: 999,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
