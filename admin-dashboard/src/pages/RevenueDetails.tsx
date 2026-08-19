import { useEffect, useState } from 'react';
import { collectionGroup, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { DollarSign, ArrowLeft, Package, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RevenueDetails() {
  const navigate = useNavigate();
  const [revenueOrders, setRevenueOrders] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Fetch users first to map their details
        const usersSnap = await getDocs(collection(db, 'users'));
        const uMap: Record<string, any> = {};
        usersSnap.forEach(doc => {
          uMap[doc.id] = doc.data();
        });
        setUsersMap(uMap);

        const ordersSnap = await getDocs(collectionGroup(db, 'orders'));
        const orders: any[] = [];
        
        ordersSnap.forEach((doc) => {
          const data = doc.data();
          if (data.pricing?.total) {
            let dateStr = 'Unknown Date';
            if (data.createdAt) {
               const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
               dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            }
            
            orders.push({
              id: doc.id,
              ...data,
              formattedDate: dateStr,
              userId: doc.ref.parent.parent?.id || 'Unknown'
            });
          }
        });

        // Sort by newest first
        orders.sort((a, b) => {
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeB - timeA;
        });

        setRevenueOrders(orders);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRevenueData();
  }, []);

  if (loading) return <div>Loading Revenue Data...</div>;

  const totalRevenue = revenueOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px', color: 'var(--text-light)' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Revenue Breakdown</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Detailed order-by-order income analysis</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Total Lifetime Revenue</div>
          <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--success)' }}>₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '16px' }}>
          <DollarSign size={40} color="var(--success)" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {revenueOrders.map((order) => {
          const userDetails = usersMap[order.userId];
          const userName = userDetails?.fullName || 'Unknown Customer';
          const userPhone = userDetails?.phone || '';
          const isExpanded = expandedOrders[order.id];

          return (
            <div key={order.id} className="glass-panel" style={{ padding: '20px' }}>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingBottom: isExpanded ? '16px' : '0', marginBottom: isExpanded ? '16px' : '0', cursor: 'pointer' }}
                onClick={() => toggleOrder(order.id)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>Order #{order.id.slice(-6).toUpperCase()}</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>{order.status}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{order.formattedDate}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>₹{order.pricing?.total}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '14px', justifyContent: 'flex-end' }}>
                      <User size={14} /> {userName} {userPhone && `(${userPhone})`}
                    </div>
                  </div>
                  <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package size={16} /> Items Purchased
                  </div>
                  
                  {order.items && order.items.length > 0 ? (
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px' }}>
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx !== order.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-light)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{item.qty}x</span>
                            <span style={{ color: 'var(--text-light)' }}>{item.name}</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)' }}>₹{item.price * item.qty}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '14px' }}>No items recorded for this order.</div>
                  )}
                </div>
              )}
              
            </div>
          );
        })}

        {revenueOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No revenue generating orders found yet.
          </div>
        )}
      </div>
    </div>
  );
}
