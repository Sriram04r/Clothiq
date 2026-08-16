import { useEffect, useState } from 'react';
import { collectionGroup, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we aggregate customers based on orders.
    // In a real production app, we would have a top level "users" collection with user profiles
    const fetchCustomers = async () => {
      try {
        // 1. Fetch user profiles
        const usersSnap = await getDocs(collection(db, 'users'));
        const userProfiles = new Map();
        usersSnap.forEach((doc) => {
          userProfiles.set(doc.id, doc.data());
        });

        // 2. Fetch orders and aggregate
        const ordersSnap = await getDocs(collectionGroup(db, 'orders'));
        const customerMap = new Map();
        
        ordersSnap.forEach((doc) => {
          const data = doc.data();
          const userId = doc.ref.parent.parent?.id;
          if (!userId) return;

          if (!customerMap.has(userId)) {
            const profile = userProfiles.get(userId) || {};
            customerMap.set(userId, {
              id: userId,
              name: profile.fullName || profile.name || 'Unknown User',
              email: profile.email || 'No Email',
              phone: profile.phone || 'No Phone',
              address: data.shippingAddress ? `${data.shippingAddress.houseNo || ''} ${data.shippingAddress.area || ''} ${data.shippingAddress.pincode || ''}`.trim() || 'Address not provided' : 'No Address',
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: null
            });
          }
          
          const customer = customerMap.get(userId);
          customer.totalOrders += 1;
          
          // Update address if missing
          if (customer.address === 'No Address' && data.shippingAddress) {
            customer.address = `${data.shippingAddress.houseNo || ''} ${data.shippingAddress.area || ''} ${data.shippingAddress.pincode || ''}`.trim() || 'Address not provided';
          }
          
          if (data.pricing?.total) {
            customer.totalSpent += data.pricing.total;
          }
          
          const orderDate = data.createdAt?.toMillis ? data.createdAt.toMillis() : 0;
          if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
            customer.lastOrderDate = orderDate;
          }
        });

        setCustomers(Array.from(customerMap.values()));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="var(--primary)" /></div>;

  return (
    <div className="animate-in">
      <h1 className="page-title">Customer Directory</h1>
      
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Customer Info</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Location</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Total Orders</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Lifetime Value</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id} className={`animate-in delay-${(index % 4) + 1}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{customer.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{customer.email}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{customer.phone}</div>
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{customer.address}</td>
                <td style={{ padding: '16px' }}>{customer.totalOrders}</td>
                <td style={{ padding: '16px', color: 'var(--success)' }}>₹{customer.totalSpent}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                  {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
