import React from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { getAuth, signOut } from '@react-native-firebase/auth';

export default function AdminDashboardWebView() {
  const handleMessage = async (event: any) => {
    if (event.nativeEvent.data === 'LOGOUT') {
      try {
        const auth = getAuth();
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out natively:", error);
      }
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
      />
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
  }
});
