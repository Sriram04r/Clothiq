import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Phone, Calendar, Users, X } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function ViewProfileScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    profilePic: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    let initialName = user.displayName || '';
    let initialEmail = user.email || '';
    let initialPhone = user.phoneNumber || '';

    const db = getFirestore();
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap && (typeof docSnap.exists === 'function' ? docSnap.exists() : docSnap.exists)) {
        const data = docSnap.data();
        setUserData({
          fullName: data?.fullName || initialName,
          email: data?.email || initialEmail,
          phone: data?.phone || initialPhone,
          dob: data?.dob || '',
          gender: data?.gender || '',
          profilePic: data?.profilePic || null
        });
      } else {
        setUserData({
          fullName: initialName,
          email: initialEmail,
          phone: initialPhone,
          dob: '',
          gender: '',
          profilePic: null
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('profile')}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editButtonText}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#1C158A" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <TouchableOpacity style={styles.avatarCircle} onPress={() => { if (userData.profilePic) setImageModalVisible(true) }} activeOpacity={0.8}>
                {userData.profilePic ? (
                  <Image source={{ uri: userData.profilePic }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                ) : (
                  <User size={50} color="#1C158A" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <User size={20} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t('name')}</Text>
                  <Text style={styles.infoValue}>{userData.fullName || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Mail size={20} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t('email')}</Text>
                  <Text style={styles.infoValue}>{userData.email || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Phone size={20} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t('phone')}</Text>
                  <Text style={styles.infoValue}>{userData.phone || 'Not provided'}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Calendar size={20} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t('Date of Birth', 'Date of Birth')}</Text>
                  <Text style={styles.infoValue}>{userData.dob || 'Not provided'}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Users size={20} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t('Gender', 'Gender')}</Text>
                  <Text style={styles.infoValue}>{userData.gender ? t(userData.gender, userData.gender) : 'Not provided'}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Full Image Modal */}
      <Modal visible={isImageModalVisible} transparent={true} animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.imageModalCloseBtn} onPress={() => setImageModalVisible(false)}>
            <X size={32} color="#FFF" />
          </TouchableOpacity>
          {userData.profilePic && (
            <Image source={{ uri: userData.profilePic }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
  },
  editButtonText: {
    color: '#1C158A',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1C158A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
});
