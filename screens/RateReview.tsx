import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, Plus } from 'lucide-react-native';

export default function RateReviewScreen({ navigation }: any) {
  const [rating, setRating] = useState(4);
  const [reviewTitle, setReviewTitle] = useState('Great Service!');
  const [reviewBody, setReviewBody] = useState('Clothes were very clean and neatly packed.Delivery was on time');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Rate & Review</Text>
          <Text style={styles.headerSubtitle}>How was your experience?</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Star 
                size={32} 
                color={star <= rating ? '#FFD700' : '#D1D5DB'} 
                fill={star <= rating ? '#FFD700' : 'transparent'} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Review Input */}
        <View style={styles.inputContainer}>
          <TextInput placeholderTextColor="#9ca3af"
            style={styles.textInputTitle}
            placeholder="Review Title"
            value={reviewTitle}
            onChangeText={setReviewTitle}
          />
          <View style={styles.inputDivider} />
          <TextInput placeholderTextColor="#9ca3af"
            style={styles.textInputBody}
            multiline
            numberOfLines={4}
            placeholder="Write your review here..."
            value={reviewBody}
            onChangeText={setReviewBody}
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.sectionTitle}>Add photos (Optional)</Text>
        
        {/* Photo Upload Row */}
        <View style={styles.photosRow}>
          <View style={styles.photoPlaceholder}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&h=200&fit=crop' }} 
              style={styles.uploadedPhoto} 
            />
          </View>
          <View style={styles.photoPlaceholder}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&h=200&fit=crop' }} 
              style={styles.uploadedPhoto} 
            />
          </View>
          <TouchableOpacity style={styles.addPhotoBtn}>
            <Plus size={24} color="#666" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.submitText}>Submit Review</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.skipBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
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
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 32,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    marginBottom: 32,
    backgroundColor: '#FFF',
  },
  textInputTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    padding: 16,
  },
  inputDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  textInputBody: {
    fontSize: 13,
    color: '#111',
    lineHeight: 20,
    padding: 16,
    height: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
  },
  addPhotoBtn: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F9F5F5', // Very light pink/gray
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    gap: 16,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  submitBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    color: '#4A3AFF', // Purple-blue text matching screenshot
    fontSize: 15,
    fontWeight: '500',
  },
});
