import { useEffect, useState, useRef } from 'react';
import { collectionGroup, collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, ChevronDown, ChevronUp, Phone, MapPin, Package } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const playAdminBeep = () => {
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(e => console.log("Browser blocked audio play.", e));
    } catch (e) {
      console.log("Audio play failed.", e);
    }
  };

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
          if (!isInitialLoad.current) {
            const hasNewOrder = snapshot.docChanges().some(change => change.type === 'added');
            if (hasNewOrder) {
              playAdminBeep();
            }
          }
          isInitialLoad.current = false;

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

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'khata': return <span style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>Monthly Khata</span>;
      case 'cod': return <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>Cash on Delivery</span>;
      case 'upi_qr': return <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>UPI QR</span>;
      default: return <span style={{ background: 'rgba(156,163,175,0.15)', color: '#9ca3af', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>{method || 'Pending'}</span>;
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="var(--primary)" /></div>;

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      <h1 className="page-title">Order Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Review incoming orders, assign drivers, and manage fulfillments.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No orders found.
          </div>
        )}

        {orders.map((order, index) => {
          const isExpanded = expandedOrderId === order.id;
          const address = order.shippingAddress || {};
          const items = order.items || [];
          
          return (
            <div key={order.id} className={`glass-panel animate-in delay-${(index % 4) + 1}`} style={{ padding: '0', overflow: 'hidden', border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-light)' }}>
              
              {/* Card Header (Always Visible) */}
              <div 
                className="responsive-flex"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                onClick={() => toggleExpand(order.id)}
              >
                <div className="responsive-flex" style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1 }}>
                  {/* Order ID & Date */}
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>#{order.id.substring(0, 6).toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleString() : 'Just now'}
                    </div>
                  </div>

                  {/* Customer Quick Info */}
                  <div style={{ minWidth: '180px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {address.fullName || 'Unknown Customer'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {address.area || 'Unknown Area'}
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {getPaymentBadge(order.paymentMethod)}
                    <span style={{
                      background: order.status === 'delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                      color: order.status === 'delivered' ? 'var(--success)' : 'var(--text-main)',
                      padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      border: '1px solid var(--border-light)'
                    }}>
                      {stages.find(s => s.key === order.status)?.label || order.status}
                    </span>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{order.itemsCount} Items</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>₹{order.pricing?.total || 0}</div>
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                    {isExpanded ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="responsive-flex" style={{ padding: '24px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '40px', background: 'rgba(0,0,0,0.2)' }}>
                  
                  {/* Left Column: Items */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} /> ORDER ITEMS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {items.map((item: any, i: number) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--border-light)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                              x{item.qty}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>{item.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.category} • {item.washType === 'wash_iron' ? 'Wash & Iron' : 'Wash & Fold'}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>₹{item.price * item.qty}</div>
                        </div>
                      ))}
                      {items.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No items found for this order.</div>}
                    </div>
                    
                    {/* Pricing Summary */}
                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <span>Subtotal</span>
                        <span>₹{order.pricing?.subtotal || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <span>Delivery Fee</span>
                        <span>₹{order.pricing?.deliveryFee || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <span>GST (5%)</span>
                        <span>₹{order.pricing?.gst || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '15px', fontWeight: '700' }}>
                        <span>Total Paid</span>
                        <span style={{ color: 'var(--primary)' }}>₹{order.pricing?.total || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Customer & Fulfillment */}
                  <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Customer Details */}
                    <div>
                       <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>CUSTOMER DETAILS</h3>
                       <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                         <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{address.fullName || 'Unknown Customer'}</div>
                         <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                           <Phone size={14} /> {address.phone || 'N/A'}
                         </div>
                         <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
                           <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                           <span>{address.houseNo ? `${address.houseNo}, ` : ''}{address.area}<br/>{address.city} - {address.pinCode}</span>
                         </div>
                       </div>
                    </div>

                    {/* Fulfillment Actions */}
                    <div>
                       <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>FULFILLMENT</h3>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         <div>
                           <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Update Status</label>
                           <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.userId, order.id, e.target.value)}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '10px 12px', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
                            >
                              {stages.map(stage => (
                                <option key={stage.key} value={stage.key} style={{ background: '#111', color: '#fff' }}>{stage.label}</option>
                              ))}
                            </select>
                         </div>

                         <div>
                           <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Assign Driver</label>
                           <select
                              value={order.driverId || ''}
                              onChange={(e) => assignDriver(order.userId, order.id, e.target.value)}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '10px 12px', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
                            >
                              <option value="" disabled style={{ background: '#111', color: '#fff' }}>Assign a driver...</option>
                              {drivers.map(driver => (
                                <option key={driver.id} value={driver.id} style={{ background: '#111', color: '#fff' }}>{driver.fullName || driver.name || 'Unnamed Driver'}</option>
                              ))}
                            </select>
                         </div>
                       </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
