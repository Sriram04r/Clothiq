import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Truck, MapPin, ReceiptText } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function OrderDetailsScreen({ route, navigation }: any) {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
        </View>
        <ActivityIndicator size="large" color="#1C158A" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>Order not found.</Text>
      </SafeAreaView>
    );
  }

  const { pricing, shippingAddress, itemsCount, pickupSchedule, deliveryOption } = order;
  const displayDate = pickupSchedule?.date 
    ? new Date(pickupSchedule.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : 'Unknown Date';

  const generateInvoice = async () => {
    try {
      setIsGenerating(true);
      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 40px; }
              .title { font-size: 28px; font-weight: bold; color: #1C158A; }
              .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
              .details-container { display: flex; justify-content: space-between; margin-bottom: 40px; }
              .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              .text { font-size: 14px; line-height: 1.5; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th { text-align: left; padding: 12px; border-bottom: 2px solid #ddd; color: #666; }
              td { padding: 12px; border-bottom: 1px solid #ddd; }
              .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
              .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Clothiq Premium Care</div>
              <div class="subtitle">Tax Invoice / Bill of Supply</div>
            </div>
            
            <div class="details-container">
              <div>
                <div class="section-title">Order Details</div>
                <div class="text"><strong>Order ID:</strong> FW${orderId?.substring(0, 6).toUpperCase()}</div>
                <div class="text"><strong>Order Date:</strong> ${displayDate}</div>
                <div class="text"><strong>Status:</strong> ${order.status || 'In Progress'}</div>
                <div class="text"><strong>Pickup Slot:</strong> ${pickupSchedule?.time || 'N/A'}</div>
                <div class="text"><strong>Payment:</strong> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</div>
              </div>
              <div style="text-align: right;">
                <div class="section-title" style="text-align: right;">Billed To</div>
                <div class="text"><strong>${getAuth().currentUser?.displayName || 'Customer'}</strong></div>
                ${getAuth().currentUser?.email ? `<div class="text">${getAuth().currentUser?.email}</div>` : ''}
                <div class="text">${shippingAddress?.houseNo ? shippingAddress.houseNo + ', ' : ''}${shippingAddress?.area || ''}</div>
                <div class="text">${shippingAddress?.pincode || ''}</div>
                ${shippingAddress?.type ? `<div class="text" style="color: #666; font-size: 12px; margin-top: 4px;">(${shippingAddress.type})</div>` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Wash & Fold (${itemsCount || 0} items)</td>
                  <td style="text-align: right;">&#8377;${pricing?.subtotal || 0}</td>
                </tr>
                <tr>
                  <td>Pickup & Delivery ${deliveryOption === 'express' ? '(Express)' : ''}</td>
                  <td style="text-align: right;">&#8377;${pricing?.deliveryFee || 0}</td>
                </tr>
                <tr>
                  <td>Coupon Discount</td>
                  <td style="text-align: right; color: red;">- &#8377;${pricing?.discount || 0}</td>
                </tr>
                <tr>
                  <td>GST (5%)</td>
                  <td style="text-align: right;">&#8377;${pricing?.gst || 0}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Amount</td>
                  <td style="text-align: right;">&#8377;${pricing?.total || 0}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              Thank you for choosing Clothiq!<br>
              For any queries, contact support@clothiq.com
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Download Invoice',
          UTI: 'com.adobe.pdf'
        });
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Order Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.orderIdText}>Order ID: FW{orderId?.substring(0, 6).toUpperCase()}</Text>
        
        <Text style={styles.sectionTitle}>Order Items</Text>
        
        <View style={styles.receiptContainer}>
          
          <View style={styles.receiptItem}>
            <View style={styles.receiptLeft}>
              <View style={styles.receiptIconBox}>
                <ReceiptText size={20} color="#111" />
              </View>
              <View>
                <Text style={styles.itemTitle}>{itemsCount || 0} items</Text>
                <Text style={styles.itemSubtitle}>Wash & Fold</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>₹{pricing?.subtotal || 0}</Text>
          </View>

          <View style={styles.receiptItem}>
            <View style={styles.receiptLeft}>
              <View style={styles.receiptIconBox}>
                <Truck size={20} color="#111" />
              </View>
              <View>
                <Text style={styles.itemTitle}>Pickup & Delivery {deliveryOption === 'express' && '(Express)'}</Text>
                <Text style={styles.itemSubtitle}>{displayDate}, {pickupSchedule?.time || ''}</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>₹{pricing?.deliveryFee || 0}</Text>
          </View>

          <View style={styles.receiptItemRow}>
            <Text style={styles.receiptRowLabel}>Coupon Discount (FRESH20)</Text>
            <Text style={styles.receiptRowValueRed}>- ₹{pricing?.discount || 0}</Text>
          </View>

          <View style={styles.receiptItemRow}>
            <Text style={styles.receiptRowLabel}>GST (5%)</Text>
            <Text style={styles.receiptRowValue}>₹{pricing?.gst || 0}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{pricing?.total || 0}</Text>
          </View>
          
        </View>

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        
        <View style={styles.addressCard}>
          <MapPin size={24} color="#1C158A" style={styles.addressIcon} />
          <View>
            <Text style={styles.addressTitle}>{shippingAddress?.type || 'Home'}</Text>
            <Text style={styles.addressText}>{shippingAddress?.houseNo ? `${shippingAddress.houseNo}, ` : ''}{shippingAddress?.area || 'Address not found'}</Text>
            <Text style={styles.addressText}>{shippingAddress?.pincode ? `Pincode: ${shippingAddress.pincode}` : ''}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.invoiceBtn} onPress={generateInvoice} disabled={isGenerating}>
          {isGenerating ? (
            <ActivityIndicator size="small" color="#1C158A" />
          ) : (
            <Text style={styles.invoiceBtnText}>Download Invoice</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.trackBtn}
          onPress={() => navigation.navigate('TrackOrder', { orderId })}
        >
          <Text style={styles.trackBtnText}>Track Order</Text>
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
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  receiptContainer: {
    marginBottom: 32,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  receiptRowLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  receiptRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  receiptRowValueRed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  addressCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE4E6', // Light pink border
    borderRadius: 12,
    backgroundColor: '#FFFBFC', // Very slight pink tint matching design
    alignItems: 'center',
  },
  addressIcon: {
    marginRight: 12,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    gap: 16,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    }),
  },
  invoiceBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1C158A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceBtnText: {
    color: '#1C158A',
    fontSize: 14,
    fontWeight: '600',
  },
  trackBtn: {
    flex: 1,
    backgroundColor: '#1C158A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
