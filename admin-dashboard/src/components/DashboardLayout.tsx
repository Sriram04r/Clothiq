import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, LogOut, Search, Bell, X, CheckCircle2, List } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // We removed orderBy to prevent Firebase Composite Index errors. We will sort in memory.
    const q = query(
      collection(db, 'support_tickets'),
      where('status', '==', 'open')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newTickets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in memory (newest first)
      newTickets.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      setTickets(newTickets);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage('LOGOUT');
    }
    navigate('/login');
  };

  const markTicketResolved = async (ticketId: string) => {
    try {
      await updateDoc(doc(db, 'support_tickets', ticketId), {
        status: 'resolved'
      });
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Top Header (Hidden on Desktop) */}
      <div className="mobile-header" style={{ display: 'none' }}>
        <h2 style={{ color: 'var(--primary)', fontSize: '20px', letterSpacing: '-0.5px', margin: 0 }}>Clothiq Admin</h2>
        <button onClick={handleLogout} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '500' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Sidebar / Bottom Nav */}
      <aside className="sidebar animate-in">
        <div className="desktop-brand" style={{ marginBottom: '40px', paddingLeft: '8px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '24px', letterSpacing: '-1px' }}>Clothiq Admin</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} /> <span className="nav-text">Overview</span>
          </NavLink>
          <NavLink 
            to="/orders" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ShoppingBag size={20} /> <span className="nav-text">Orders</span>
          </NavLink>
          <NavLink 
            to="/customers" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={20} /> <span className="nav-text">Customers</span>
          </NavLink>
          <NavLink 
            to="/menu" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <List size={20} /> <span className="nav-text">Menu</span>
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="nav-item desktop-logout" style={{ color: 'var(--danger)', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: '15px' }}>
          <LogOut size={20} /> <span className="nav-text">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search orders, customers..." 
              style={{ paddingLeft: '40px', borderRadius: '20px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-ghost" 
                style={{ padding: '8px', borderRadius: '50%' }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {tickets.length > 0 && (
                  <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', width: '320px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid var(--border)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Support Tickets</h3>
                    <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {tickets.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No open support tickets.
                      </div>
                    ) : (
                      tickets.map(ticket => (
                        <div key={ticket.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>{ticket.userName}</div>
                            <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--primary)' }}>{ticket.subject}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{ticket.message}</div>
                          </div>
                          <button 
                            onClick={() => markTicketResolved(ticket.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)', alignSelf: 'flex-start', padding: '4px' }}
                            title="Mark as resolved"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Admin</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Store Manager</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'white' }}>
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
