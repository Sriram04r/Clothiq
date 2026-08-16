import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingPickups: 0,
    activeCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnap = await getDocs(collectionGroup(db, 'orders'));
        
        let revenue = 0;
        let count = 0;
        let pending = 0;
        let uniqueUsers = new Set();
        
        ordersSnap.forEach((doc) => {
          const data = doc.data();
          count++;
          
          if (data.pricing?.total) {
            revenue += data.pricing.total;
          }
          
          if (data.status === 'placed' || data.status === 'placed_cod' || data.status === 'pickup') {
            pending++;
          }
          
          // Assuming user ID is the parent doc name, can extract from ref.parent.parent.id
          if (doc.ref.parent.parent) {
            uniqueUsers.add(doc.ref.parent.parent.id);
          }
        });

        setStats({
          totalRevenue: revenue,
          totalOrders: count,
          pendingPickups: pending,
          activeCustomers: uniqueUsers.size
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-in">
      <h1 className="page-title">Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Live metrics from your Clothiq platform</p>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="glass-panel animate-in delay-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Revenue</div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <DollarSign size={20} color="var(--success)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>₹{stats.totalRevenue.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '14px' }}>
            <TrendingUp size={16} /> <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="glass-panel animate-in delay-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Orders</div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <ShoppingBag size={20} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{stats.totalOrders}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '14px' }}>
            Across all time
          </div>
        </div>

        <div className="glass-panel animate-in delay-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Pending Pickups</div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <Activity size={20} color="var(--warning)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{stats.pendingPickups}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontSize: '14px' }}>
            Needs attention
          </div>
        </div>

        <div 
          className="glass-panel animate-in delay-4"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/customers')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Active Customers</div>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <Users size={20} color="var(--accent)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{stats.activeCustomers}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '14px' }}>
            Unique accounts with orders
          </div>
        </div>
      </div>
      
    </div>
  );
}
