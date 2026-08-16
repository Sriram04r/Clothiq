import { useEffect, useState } from 'react';
import { collectionGroup, collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'driver'));
        const snap = await getDocs(q);
        const d = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDrivers(d);
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };
    
    const fetchOrders = async () => {
      try {
        const q = collectionGroup(db, 'orders');
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedOrders: any[] = [];
          snapshot.forEach((doc) => {
            fetchedOrders.push({
              id: doc.id,
              userId: doc.ref.parent.parent?.id,
              ...doc.data()
            });
          });
          
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
    
    fetchDrivers();
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

  const assignDriver = async (userId: string, orderId: string, driverId: string) => {
    if (!userId || !orderId || !driverId) return;
    try {
      const orderRef = doc(db, 'users', userId, 'orders', orderId);
      await updateDoc(orderRef, { driverId });
    } catch (err) {
      console.error("Error assigning driver:", err);
      alert("Failed to assign driver");
    }
  };

  const stages = [
    { key: 'placed_cod', label: 'Placed (COD)' },
    { key: 'paid', label: 'Placed (Paid)' },
    { key: 'pickup_ready', label: 'Pickup Ready' },
    { key: 'out_for_pickup', label: 'Out for Pickup' },
    { key: 'washing', label: 'Washing' },
    { key: 'delivery_ready', label: 'Delivery Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="var(--primary)" /></div>;

  return (
    <div className="animate-in">
      <h1 className="page-title">Order Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Assign drivers and update order status in real-time.</p>
      
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Order ID</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Items</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Total</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Current Status</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Driver</th>
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
                  {order.status === 'delivered' ? (
                    <span style={{ color: 'var(--text-muted)' }}>{drivers.find(d => d.id === order.driverId)?.name || 'N/A'}</span>
                  ) : (
                    <select 
                      value={order.driverId || ''} 
                      onChange={(e) => assignDriver(order.userId, order.id, e.target.value)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--border-light)', 
                        color: 'var(--text-main)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    >
                      <option value="" disabled>Assign Driver...</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.fullName || driver.name || 'Unnamed Driver'}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  {order.status !== 'delivered' && (
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.userId, order.id, e.target.value)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--border-light)', 
                        color: 'var(--text-main)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    >
                      {stages.map(stage => (
                        <option key={stage.key} value={stage.key}>{stage.label}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
