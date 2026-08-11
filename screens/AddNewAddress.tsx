import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Circle, CircleDot } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from '@react-native-firebase/firestore';

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
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
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>House No..Building Name</Text>
            <TextInput style={styles.input} value={houseNo} onChangeText={setHouseNo} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area / Locality</Text>
            <TextInput style={styles.input} value={area} onChangeText={setArea} />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={city} onChangeText={setCity} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>PIN Code</Text>
              <TextInput style={styles.input} value={pinCode} onChangeText={setPinCode} keyboardType="number-pad" />
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
