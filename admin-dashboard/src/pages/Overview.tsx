import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingPickups: 0,
    activeCustomers: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnap = await getDocs(collectionGroup(db, 'orders'));
        
        let revenue = 0;
        let count = 0;
        let pending = 0;
        let uniqueUsers = new Set();
        
        const dateMap = new Map<string, { date: string; revenue: number; orders: number }>();
        
        ordersSnap.forEach((doc) => {
          const data = doc.data();
          count++;
          
          const orderRev = data.pricing?.total || 0;
          revenue += orderRev;
          
          if (data.status === 'placed' || data.status === 'placed_cod' || data.status === 'pickup') {
            pending++;
          }
          
          // Assuming user ID is the parent doc name, can extract from ref.parent.parent.id
          if (doc.ref.parent.parent) {
            uniqueUsers.add(doc.ref.parent.parent.id);
          }
          
          // Analytics Chart Grouping
          let dateStr = 'Unknown';
          if (data.createdAt) {
             const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
             dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
          }
          const existing = dateMap.get(dateStr)!;
          existing.revenue += orderRev;
          existing.orders += 1;
        });

        // Convert map to array for recharts
        const sortedData = Array.from(dateMap.values());
        setChartData(sortedData);

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
        
        <div 
          className="glass-panel animate-in delay-1"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/orders')}
        >
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

        <div 
          className="glass-panel animate-in delay-2"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/orders')}
        >
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

        <div 
          className="glass-panel animate-in delay-3"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/orders')}
        >
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
      
      {/* Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
        
        {/* Revenue Area Chart */}
        <div className="glass-panel animate-in delay-4" style={{ height: '400px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            Revenue Over Time
          </h2>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                itemStyle={{ color: 'var(--text-light)', fontWeight: '600' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Volume Bar Chart */}
        <div className="glass-panel animate-in delay-5" style={{ height: '400px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--accent)" />
            Order Volume
          </h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                itemStyle={{ color: 'var(--accent)', fontWeight: '600' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: number) => [value, 'Orders']}
              />
              <Bar dataKey="orders" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
