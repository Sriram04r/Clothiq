import React from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { getAuth, signOut } from '@react-native-firebase/auth';

export default function AdminDashboardWebView() {
  const handleMessage = async (event: any) => {
    if (event.nativeEvent.data === 'LOGOUT') {
      await handleNativeLogout();
    }
  };

  const handleNativeLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out natively:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <WebView 
        source={{ uri: 'https://clothiq-7314a.web.app?v=' + Date.now() }} 
        style={styles.webview}
        onMessage={handleMessage}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2945FF" />
          </View>
        )}
        renderError={() => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load Admin Portal.</Text>
            <TouchableOpacity style={styles.emergencyLogoutButton} onPress={handleNativeLogout}>
              <Text style={styles.emergencyLogoutText}>Force Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      {/* Floating Fallback Logout Button */}
      <TouchableOpacity style={styles.floatingLogout} onPress={handleNativeLogout}>
        <LogOut size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
  },
  emergencyLogoutButton: {
    backgroundColor: '#2945FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyLogoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  floatingLogout: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ef4444',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  }
});
