import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Notifications from 'expo-notifications';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

GoogleSignin.configure({
  webClientId: '930212381030-t1tg6a36ciu6n5220polmkaug00n3tug.apps.googleusercontent.com',
});

// Import Screens
import OnboardingScreen from './screens/Onboarding';
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import ServicesScreen from './screens/Services';
import SelectItemsScreen from './screens/SelectItems';
import CartScreen from './screens/Cart';
import SelectAddressScreen from './screens/SelectAddress';
import PickupDeliveryScreen from './screens/PickupDelivery';
import OrderSummaryScreen from './screens/OrderSummary';
import PaymentScreen from './screens/Payment';
import OrderConfirmationScreen from './screens/OrderConfirmation';
import TrackOrderScreen from './screens/TrackOrder';
import DeliverySuccessScreen from './screens/DeliverySuccess';
import RateReviewScreen from './screens/RateReview';
import ProfileScreen from './screens/Profile';
import SignupScreen from './screens/Signup';
import OTPVerificationScreen from './screens/OTPVerification';
import ForgotPasswordScreen from './screens/ForgotPassword';
import ResetPasswordScreen from './screens/ResetPassword';
import ServiceDetailsScreen from './screens/ServiceDetails';
import OrderHistoryScreen from './screens/OrderHistory';
import OrderDetailsScreen from './screens/OrderDetails';
import EditProfileScreen from './screens/EditProfile';
import SavedAddressesScreen from './screens/SavedAddresses';
import AddNewAddressScreen from './screens/AddNewAddress';
import NotificationsScreen from './screens/Notifications';

// Driver Screens (Removed for User App)

import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useContext, useEffect } from 'react';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, initializing, wasLoggedIn, hasOnboarded, userRole } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true }
          });
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus === 'granted') {
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            const db = getFirestore();
            await setDoc(doc(db, 'users', user.uid), { pushToken: token }, { merge: true });
          }
        } catch (error) {
          console.log("Error getting push token", error);
        }
      })();
    }
  }, [user]);

  if (initializing) {
    return null; // Don't render until auth state is loaded
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
          <Stack.Screen name="SelectItems" component={SelectItemsScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />
          <Stack.Screen name="PickupDelivery" component={PickupDeliveryScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
          <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
          <Stack.Screen name="DeliverySuccess" component={DeliverySuccessScreen} />
          <Stack.Screen name="RateReview" component={RateReviewScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
          <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </>
      ) : (
        <>
          {!hasOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              {!wasLoggedIn && <Stack.Screen name="Splash" component={SplashScreen} />}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
