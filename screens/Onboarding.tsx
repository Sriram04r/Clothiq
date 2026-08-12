import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Premium Laundry Service',
    subtitle: 'Let us handle the dirty work. We provide top-notch cleaning for all your garments.',
    image: require('../assets/onboarding_laundry.png')
  },
  {
    id: '2',
    title: 'Fast & Reliable Delivery',
    subtitle: 'Get your clothes back fresh and folded within 24-48 hours.',
    image: require('../assets/onboarding_delivery.png')
  },
  {
    id: '3',
    title: 'Eco-Friendly Process',
    subtitle: 'We use gentle, environmentally friendly products that care for your clothes and the planet.',
    image: require('../assets/onboarding_eco.png')
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const { completeOnboarding } = React.useContext(AuthContext);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flatListContainer}>
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 24, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View 
                key={i.toString()} 
                style={[styles.dot, { width: dotWidth, opacity }]} 
              />
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={scrollToNext}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
            {currentIndex !== slides.length - 1 && (
              <ChevronRight size={20} color="#FFF" style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  flatListContainer: {
    flex: 3,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1C158A',
    marginHorizontal: 6,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#1C158A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#1C158A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  }
});
