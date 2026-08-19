import { useEffect, useState } from 'react';
import { collectionGroup, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendingPickups() {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingData = async () => {
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
          // Filter for pending pickups exactly as defined in Overview.tsx
          if (data.status === 'placed' || data.status === 'placed_cod' || data.status === 'pickup') {
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

        // Sort by oldest first for pickups (prioritize those waiting longest)
        orders.sort((a, b) => {
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeA - timeB;
        });

        setPendingOrders(orders);
      } catch (err) {
        console.error("Error fetching pending pickups:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingData();
  }, []);

  if (loading) return <div>Loading Pending Pickups...</div>;

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px', color: 'var(--text-light)' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Pending Pickups</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Orders waiting to be picked up from customers</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {pendingOrders.map((order) => {
          const userDetails = usersMap[order.userId];
          const userName = userDetails?.fullName || 'Unknown Customer';
          const userPhone = userDetails?.phone || '';
          
          return (
            <div key={order.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700' }}>Order #{order.id.slice(-6).toUpperCase()}</span>
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--warning)', fontWeight: '600' }}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: '500', marginBottom: '4px' }}>
                    {userName} {userPhone && `• ${userPhone}`}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    <Clock size={14} /> Placed: {order.formattedDate}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Expected Items</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--info)' }}>
                    {order.itemsCount || 0}
                  </div>
                </div>
              </div>

              {order.shippingAddress && (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--info)' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Pickup Address</div>
                      <div style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.5' }}>
                        {order.shippingAddress.name}<br/>
                        {order.shippingAddress.houseNo}, {order.shippingAddress.area}<br/>
                        {order.shippingAddress.landmark && <span>Landmark: {order.shippingAddress.landmark}<br/></span>}
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pendingOrders.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Clock size={40} color="var(--text-muted)" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>No picks are allocated</h2>
            <p style={{ color: 'var(--text-muted)' }}>All current orders have been picked up or there are no new orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
