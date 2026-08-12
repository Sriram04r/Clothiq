import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Home, ClipboardList, Bell, LayoutGrid, User } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const generateMapHtml = (sLat: number, sLng: number, cLat: number, cLng: number) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { padding: 0; margin: 0; }
        #map { width: 100%; height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Midpoint calculation
        var midLat = (${sLat} + ${cLat}) / 2;
        var midLng = (${sLng} + ${cLng}) / 2;

        var map = L.map('map', { zoomControl: true }).setView([midLat, midLng], 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Store Location (Home/Store icon)
        var storeIcon = L.divIcon({
            html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#1C158A" stroke="#FFF" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        var storeMarker = L.marker([${sLat}, ${sLng}], {icon: storeIcon}).addTo(map);

        // Customer Location (Pin icon)
        var customerIcon = L.divIcon({
            html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#FF3B30" stroke="#FFF" stroke-width="2"><circle cx="12" cy="10" r="3" fill="#FFF"></circle><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>',
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });
        var customerMarker = L.marker([${cLat}, ${cLng}], {icon: customerIcon}).addTo(map);

        // Draw Polyline Route
        var latlngs = [
            [${sLat}, ${sLng}],
            [midLat, midLng],
            [${cLat}, ${cLng}]
        ];
        var polyline = L.polyline(latlngs, {color: '#1C158A', weight: 4, dashArray: '10, 10'}).addTo(map);

        // Fix missing tiles crash by relying on setView instead of fitBounds
        
        // Notify React Native when user touches map to lock scroll
        document.getElementById('map').addEventListener('touchstart', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapTouchStart' }));
        }, { passive: true });
        
        document.getElementById('map').addEventListener('touchend', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapTouchEnd' }));
        }, { passive: true });
        
        document.getElementById('map').addEventListener('touchcancel', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapTouchEnd' }));
        }, { passive: true });
    </script>
</body>
</html>
`;

const timelineSteps = [
  { id: '1', title: 'Order Placed', time: '15 May, 10:30 AM', status: 'completed' },
  { id: '2', title: 'Pickup Completed', time: '15 May, 11:45 AM', status: 'completed' },
  { id: '3', title: 'Washing in Progress', time: '15 May, 2:30 PM', status: 'active' },
  { id: '4', title: 'Drying', time: '', status: 'pending' },
  { id: '5', title: 'Ironing', time: '', status: 'pending' },
  { id: '6', title: 'Quality Check', time: '', status: 'pending' },
  { id: '7', title: 'Out for Delivery', time: '', status: 'pending' },
  { id: '8', title: 'Delivered', time: '', status: 'pending' },
];

export default function TrackOrderScreen({ navigation }: any) {
  const [mapActive, setMapActive] = useState(false);
  const [mapHtml, setMapHtml] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback to New Delhi if permission denied
        setMapHtml(generateMapHtml(28.6250, 77.2150, 28.6010, 77.1950));
        return;
      }
      
      let loc = await Location.getCurrentPositionAsync({});
      const cLat = loc.coords.latitude;
      const cLng = loc.coords.longitude;
      
      // Simulate store location slightly offset from customer
      const sLat = cLat + 0.015;
      const sLng = cLng + 0.015;
      
      setMapHtml(generateMapHtml(sLat, sLng, cLat, cLng));
    })();
  }, []);

  const onWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapTouchStart') {
        setMapActive(true);
      } else if (data.type === 'mapTouchEnd') {
        setMapActive(false);
      }
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Track your Order</Text>
          <Text style={styles.headerSubtitle}>Order ID: FW123456</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={!mapActive}
      >
        <View style={styles.mapContainer}>
          {mapHtml ? (
            <WebView
              source={{ html: mapHtml }}
              style={styles.map}
              originWhitelist={['*']}
              scrollEnabled={false}
              bounces={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              javaScriptEnabled={true}
              onMessage={onWebViewMessage}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#1C158A" />
            </View>
          )}
        </View>

        <View style={styles.timelineContainer}>
          {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            
            return (
              <View key={step.id} style={styles.timelineRow}>
                {/* Left side: Icon and Line */}
                <View style={styles.iconColumn}>
                  <View style={[
                    styles.node, 
                    isCompleted && styles.nodeCompleted,
                    isActive && styles.nodeActive,
                    step.status === 'pending' && styles.nodePending
                  ]}>
                    {isCompleted && <Check size={14} color="#FFF" strokeWidth={3} />}
                    {isActive && <Check size={14} color="#FFF" strokeWidth={3} />}
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.line, 
                      isCompleted ? styles.lineCompleted : styles.linePending
                    ]} />
                  )}
                </View>
                
                {/* Right side: Content */}
                <TouchableOpacity 
                  style={styles.contentColumn}
                  onPress={() => {
                    // Hidden shortcut to test delivery page
                    if (isLast) navigation.navigate('DeliverySuccess');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.stepTitle, 
                    isActive && styles.stepTitleActive,
                    step.status === 'pending' && styles.stepTitlePending
                  ]}>{step.title}</Text>
                  {step.time ? <Text style={styles.stepTime}>{step.time}</Text> : null}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={24} color="#8e8e93" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ClipboardList size={24} color="#1C158A" />
          <Text style={[styles.navText, styles.navTextActive]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Bell size={24} color="#8e8e93" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Services')}>
          <LayoutGrid size={24} color="#8e8e93" />
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <User size={24} color="#8e8e93" />
          <Text style={styles.navText}>Profile</Text>
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
    paddingTop: 20,
    paddingBottom: 100, // padding for bottom nav
  },
  mapContainer: {
    height: 250,
    width: '100%',
    backgroundColor: '#EAEAEA',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  map: {
    flex: 1,
  },
  timelineContainer: {
    width: '100%',
  },
  timelineRow: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 20,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: '#34C759', // Green
  },
  nodeActive: {
    backgroundColor: '#1C158A', // Deep Blue
  },
  nodePending: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  line: {
    width: 2,
    height: 44,
    marginVertical: -2,
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: '#34C759',
  },
  linePending: {
    backgroundColor: '#E8E8E8',
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 36,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  stepTitleActive: {
    color: '#1C158A',
  },
  stepTitlePending: {
    color: '#666',
  },
  stepTime: {
    fontSize: 12,
    color: '#888',
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  navItem: {
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
});
