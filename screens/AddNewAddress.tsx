import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Circle, CircleDot, MapPin } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from '@react-native-firebase/firestore';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const mapHtml = (lat: number, lng: number) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { padding: 0; margin: 0; }
        #map { width: 100%; height: 100vh; }
        .center-marker {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            z-index: 1000;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <svg class="center-marker" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1C158A" stroke="#1C158A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#FFF"></circle>
    </svg>
    <script>
        var map = L.map('map', { zoomControl: true }).setView([${lat}, ${lng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        map.on('moveend', function() {
            var center = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'onRegionChange',
                latitude: center.lat,
                longitude: center.lng
            }));
        });
        
        window.addEventListener("message", function(event) {
            try {
                var data = JSON.parse(event.data);
                if (data.type === 'setLocation') {
                    map.setView([data.latitude, data.longitude], 15);
                }
            } catch (e) {}
        });
        
        document.addEventListener("message", function(event) {
            try {
                var data = JSON.parse(event.data);
                if (data.type === 'setLocation') {
                    map.setView([data.latitude, data.longitude], 15);
                }
            } catch (e) {}
        });

        window.addEventListener("load", function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        });
    </script>
</body>
</html>
`;

export default function AddNewAddressScreen({ navigation }: any) {
  const [addressType, setAddressType] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Location state
  const webViewRef = React.useRef<WebView>(null);
  const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 }); // Default New Delhi
  const [isLocating, setIsLocating] = useState(false);
  const [mapActive, setMapActive] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to easily set your address.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      const lat = userLocation.coords.latitude;
      const lng = userLocation.coords.longitude;
      
      setLocation({ latitude: lat, longitude: lng });
      
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'setLocation',
          latitude: lat,
          longitude: lng
        }));
      }
      
      // Reverse geocode to auto-fill address
      let geocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng
      });
      
      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        if (address.city) setCity(address.city);
        if (address.postalCode) setPinCode(address.postalCode);
        if (address.subregion || address.district) setArea(address.subregion || address.district || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLocating(false);
    }
  };

  const onWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'onRegionChange') {
        setLocation({ latitude: data.latitude, longitude: data.longitude });
      } else if (data.type === 'ready') {
        if (location.latitude !== 28.6139 || location.longitude !== 77.2090) {
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'setLocation',
            latitude: location.latitude,
            longitude: location.longitude
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!fullName || !phone || !houseNo || !area || !city || !pinCode) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      const db = getFirestore();
      const addressesRef = collection(db, 'users', user.uid, 'addresses');

      // If this is set as default, remove default from all others
      if (isDefault) {
        const q = query(addressesRef, where('isDefault', '==', true));
        const querySnapshot = await getDocs(q);
        const updatePromises = querySnapshot.docs.map(addressDoc => 
          updateDoc(doc(db, 'users', user.uid, 'addresses', addressDoc.id), {
            isDefault: false
          })
        );
        await Promise.all(updatePromises);
      }

      await addDoc(addressesRef, {
        type: addressType,
        fullName,
        phone,
        houseNo,
        area,
        city,
        pinCode,
        isDefault,
        latitude: location.latitude,
        longitude: location.longitude,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Address added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Add New Address</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={!mapActive}
      >
        
        {/* Map Section */}
        <Text style={styles.sectionLabel}>Location</Text>
        <View 
          style={styles.mapContainer}
          onTouchStart={() => setMapActive(true)}
          onTouchEnd={() => setMapActive(false)}
          onTouchCancel={() => setMapActive(false)}
        >
          <WebView
            ref={webViewRef}
            source={{ html: mapHtml(28.6139, 77.2090) }}
            style={styles.map}
            onMessage={onWebViewMessage}
            scrollEnabled={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            javaScriptEnabled={true}
          />
          
          <TouchableOpacity 
            style={styles.locateBtn} 
            onPress={getCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? <ActivityIndicator size="small" color="#1C158A" /> : <Text style={styles.locateBtnText}>Use Current Location</Text>}
          </TouchableOpacity>
        </View>

        {/* Address Type */}
        <Text style={styles.sectionLabel}>Address Type</Text>
        <View style={styles.typeContainer}>
          {['Home', 'Work', 'Other'].map((type) => (
            <TouchableOpacity 
              key={type}
              style={[styles.typePill, addressType === type && styles.activeTypePill]}
              onPress={() => setAddressType(type)}
            >
              <Text style={[styles.typeText, addressType === type && styles.activeTypeText]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput placeholder="Enter your full name" placeholderTextColor="#9ca3af" style={styles.input} value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput placeholder="Enter phone number" placeholderTextColor="#9ca3af" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>House No..Building Name</Text>
            <TextInput placeholder="E.g., Flat 101, Galaxy Apts" placeholderTextColor="#9ca3af" style={styles.input} value={houseNo} onChangeText={setHouseNo} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area / Locality</Text>
            <TextInput placeholder="E.g., Kothaguda" placeholderTextColor="#9ca3af" style={styles.input} value={area} onChangeText={setArea} />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput placeholder="City" placeholderTextColor="#9ca3af" style={styles.input} value={city} onChangeText={setCity} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>PIN Code</Text>
              <TextInput placeholder="PIN Code" placeholderTextColor="#9ca3af" style={styles.input} value={pinCode} onChangeText={setPinCode} keyboardType="number-pad" />
            </View>
          </View>

          {/* Default Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setIsDefault(!isDefault)}
            activeOpacity={0.7}
          >
            {isDefault ? (
              <CircleDot size={22} color="#111" strokeWidth={2.5} />
            ) : (
              <Circle size={22} color="#9CA3AF" />
            )}
            <Text style={styles.checkboxText}>Set as Default Address</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Address</Text>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    zIndex: 10,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mapContainer: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -36,
    zIndex: 1,
  },
  centerPin: {
  },
  locateBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locateBtnText: {
    color: '#1C158A',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  typePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTypePill: {
    backgroundColor: '#1C158A',
    borderColor: '#1C158A',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTypeText: {
    color: '#FFF',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#FFF',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  checkboxText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  saveBtn: {
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
