import { useEffect, useState } from 'react';
import { collectionGroup, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: collectionGroup requires an index in production for orderBy. 
    // For this prototype, we'll fetch all orders and sort in JS if needed.
    const fetchOrders = async () => {
      try {
        const q = collectionGroup(db, 'orders');
        // If we want real-time across ALL users, we can use onSnapshot on collectionGroup
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedOrders: any[] = [];
          snapshot.forEach((doc) => {
            fetchedOrders.push({
              id: doc.id,
              userId: doc.ref.parent.parent?.id,
              ...doc.data()
            });
          });
          
          // Sort by date descending
          fetchedOrders.sort((a, b) => {
            const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return dateB - dateA;
          });
          
          setOrders(fetchedOrders);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const updateOrderStatus = async (userId: string, orderId: string, newStatus: string) => {
    if (!userId || !orderId) return;
    try {
      const orderRef = doc(db, 'users', userId, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status");
    }
  };

  const stages = [
    { key: 'placed_cod', label: 'Placed (COD)' },
    { key: 'paid', label: 'Placed (Paid)' },
    { key: 'pickup', label: 'Pickup Ready' },
    { key: 'washing', label: 'Washing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="var(--primary)" /></div>;

  return (
    <div className="animate-in">
      <h1 className="page-title">Order Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Click a status button to instantly update the customer's live tracking.</p>
      
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Order ID</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Items</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Total</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Current Status</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Update To...</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className={`animate-in delay-${(index % 4) + 1}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>#{order.id.substring(0,6).toUpperCase()}</td>
                <td style={{ padding: '16px' }}>{order.itemsCount || 0}</td>
                <td style={{ padding: '16px' }}>₹{order.pricing?.total || 0}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    background: order.status === 'delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', 
                    color: order.status === 'delivered' ? 'var(--success)' : 'var(--primary)',
                    padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600'
                  }}>
                    {stages.find(s => s.key === order.status)?.label || order.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <select 
                    className="input-field" 
                    style={{ padding: '8px', width: 'auto', background: 'var(--bg-dark)' }}
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.userId, order.id, e.target.value)}
                  >
                    <option value="placed">Placed</option>
                    <option value="placed_cod">Placed (COD)</option>
                    <option value="paid">Placed (Paid)</option>
                    <option value="pickup">Pickup Ready</option>
                    <option value="washing">Washing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
