import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, LogOut, Search, Bell } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar animate-in">
        <div style={{ marginBottom: '40px', paddingLeft: '8px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '24px', letterSpacing: '-1px' }}>Clothiq Admin</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} /> Overview
          </NavLink>
          <NavLink 
            to="/orders" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ShoppingBag size={20} /> Orders
          </NavLink>
          <NavLink 
            to="/customers" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={20} /> Customers
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="nav-item" style={{ color: 'var(--danger)', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: '15px' }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search orders, customers..." 
              style={{ paddingLeft: '40px', borderRadius: '20px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
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
