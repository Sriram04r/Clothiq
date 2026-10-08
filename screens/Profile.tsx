import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, User, Package, MapPin, CreditCard, Tag, HelpCircle, Settings, Home, ClipboardList, Bell, LayoutGrid, Globe, X, CheckCircle2, Sparkles, Medal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ChatBotFAB from '../components/ChatBotFAB';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { id: '1', title: 'myOrders', icon: Package, screen: 'OrderHistory' },
  { id: '2', title: 'savedAddress', icon: MapPin, screen: 'SavedAddresses' },
  { id: '3', title: 'paymentMethods', icon: CreditCard, screen: 'PaymentMethods' },
  { id: '4', title: 'offersCoupons', icon: Tag },
  { id: '5', title: 'helpSupport', icon: HelpCircle, screen: 'HelpSupport' },
  { id: '6', title: 'selectLanguage', icon: Globe },
  { id: '7', title: 'profile', icon: User, screen: 'ViewProfile' },
];

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    phone: '',
    email: 'Loading...',
    profilePic: null as string | null
  });
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLangModalVisible(false);
    if (langCode !== 'en' && langCode !== 'te') {
      Alert.alert('Language Coming Soon', 'This language is not fully supported yet, defaulting to English.');
      i18n.changeLanguage('en');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    let name = user.displayName || 'App User';
    let email = user.email || '';
    let phone = user.phoneNumber || 'Add your phone number';
    let profilePic: string | null = null;

    const db = getFirestore();
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap && (typeof docSnap.exists === 'function' ? docSnap.exists() : docSnap.exists)) {
        const data = docSnap.data();
        name = data?.fullName || name;
        phone = data?.phone || phone;
        profilePic = data?.profilePic || null;
      }
      setUserData({ name, email, phone, profilePic });
    }, (error) => {
      console.error('Error fetching user doc:', error);
      setUserData({ name, email, phone, profilePic });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await signOut(auth);
      }

      // Also sign out of Google so the account picker shows up next time!
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore if they didn't sign in with Google
      }

      // Navigation happens automatically via AuthContext
    } catch (error: any) {
      if (error.code !== 'auth/no-current-user') {
        console.error('Logout error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('settings')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Unique VIP Profile Card */}
        <LinearGradient
          colors={['#1C158A', '#3921D3', '#6246F9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vipCard}
        >
          <View style={styles.vipCardContent}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity 
                style={styles.avatar} 
                onPress={() => { if (userData.profilePic) setImageModalVisible(true) }} 
                activeOpacity={0.8}
              >
                {userData.profilePic ? (
                  <Image source={{ uri: userData.profilePic }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                ) : (
                  <User size={30} color="#1C158A" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>{userData.name}</Text>
              <Text style={styles.contactText}>{userData.phone}</Text>
              <Text style={styles.contactText}>{userData.email}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editBtn} 
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.7}
            >
              <View style={styles.editBtnInner}>
                <Text style={styles.editText}>{t('edit')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === menuItems.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.title === 'selectLanguage') {
                    setLangModalVisible(true);
                  } else if (item.screen) {
                    navigation.navigate(item.screen);
                  } else {
                    Alert.alert('Coming Soon', 'This feature is currently under development.');
                  }
                }}
              >
                <View style={styles.menuIconBox}>
                  <Icon size={20} color={(item as any).color || '#444'} />
                </View>
                <Text style={styles.menuTitle}>{t(item.title)}</Text>
                <ChevronRight size={20} color="#CCC" />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Language Selection Modal */}
      <Modal visible={langModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.langModalContent}>
            <View style={styles.langModalHeader}>
              <Text style={styles.langModalTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <X size={24} color="#111" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.langItem} onPress={() => handleLanguageSelect('en')}>
              <Text style={styles.langText}>English</Text>
              {i18n.language === 'en' && <CheckCircle2 size={20} color="#1C158A" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.langItem} onPress={() => handleLanguageSelect('te')}>
              <Text style={styles.langText}>తెలుగు (Telugu)</Text>
              {i18n.language === 'te' && <CheckCircle2 size={20} color="#1C158A" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.langItem} onPress={() => handleLanguageSelect('ml')}>
              <Text style={styles.langText}>മലയാളം (Kerala)</Text>
              {i18n.language === 'ml' && <CheckCircle2 size={20} color="#1C158A" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.langItem} onPress={() => handleLanguageSelect('kn')}>
              <Text style={styles.langText}>ಕನ್ನಡ (Karnataka)</Text>
              {i18n.language === 'kn' && <CheckCircle2 size={20} color="#1C158A" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.langItem} onPress={() => handleLanguageSelect('ta')}>
              <Text style={styles.langText}>தமிழ் (Tamil)</Text>
              {i18n.language === 'ta' && <CheckCircle2 size={20} color="#1C158A" />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      <ChatBotFAB />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderHistory')}>
          <ClipboardList size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('orders')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
          <Bell size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('notifications')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Services')}>
          <LayoutGrid size={24} color="#8e8e93" />
          <Text style={styles.navText}>{t('services')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Settings size={24} color="#1C158A" />
          <Text style={[styles.navText, styles.navTextActive]}>{t('settings')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -32, // Offset back button width to truly center
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  vipCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#3921D3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  vipCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  vipBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 1,
  },
  vipCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  editBtn: {
    marginLeft: 10,
  },
  editBtnInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconBox: {
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  logoutBtn: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2', // light red border
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3B30', // red text
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8e8e93',
  },
  navTextActive: {
    color: '#1C158A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  langModalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  langModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  langModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  langText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
