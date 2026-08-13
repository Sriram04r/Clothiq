import { useEffect, useState } from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
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
        const ordersSnap = await getDocs(collectionGroup(db, 'orders'));
        
        const customerMap = new Map();
        
        ordersSnap.forEach((doc) => {
          const data = doc.data();
          const userId = doc.ref.parent.parent?.id;
          if (!userId) return;

          if (!customerMap.has(userId)) {
            customerMap.set(userId, {
              id: userId,
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: null
            });
          }
          
          const customer = customerMap.get(userId);
          customer.totalOrders += 1;
          
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
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Customer ID</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Total Orders</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Lifetime Value</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id} className={`animate-in delay-${(index % 4) + 1}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{customer.id}</td>
                <td style={{ padding: '16px' }}>{customer.totalOrders}</td>
                <td style={{ padding: '16px', color: 'var(--success)' }}>₹{customer.totalSpent}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                  {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
