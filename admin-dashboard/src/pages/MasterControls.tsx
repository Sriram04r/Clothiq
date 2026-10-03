import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Save, Plus, Trash2, Settings, List, Clock } from 'lucide-react';

export default function MasterControls() {
  const [activeTab, setActiveTab] = useState<'app' | 'catalog' | 'times'>('app');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // App Settings State
  const [appConfig, setAppConfig] = useState({
    acceptOrders: true,
    baseDeliveryFee: 40,
    expressDeliveryFee: 50,
    taxPercentage: 5
  });

  // Catalog Settings State
  const [catalog, setCatalog] = useState({
    categories: ['Men', 'Women', 'Kids', 'Household'],
    services: ['Wash & Fold', 'Dry Cleaning', 'Steam Iron', 'Wash & Iron']
  });

  // Time Slots State
  const [timeSlots, setTimeSlots] = useState([
    '9 AM – 11 AM', '11 AM – 1 PM', '1 PM – 3 PM', '3 PM – 5 PM', '5 PM – 7 PM'
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const appSnap = await getDoc(doc(db, 'master_settings', 'app_config'));
      if (appSnap.exists()) setAppConfig(appSnap.data() as any);

      const catalogSnap = await getDoc(doc(db, 'master_settings', 'catalog'));
      if (catalogSnap.exists()) setCatalog(catalogSnap.data() as any);

      const timeSnap = await getDoc(doc(db, 'master_settings', 'time_slots'));
      if (timeSnap.exists()) setTimeSlots(timeSnap.data()?.slots || []);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
    setLoading(false);
  };

  const handleSaveAppConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'master_settings', 'app_config'), appConfig);
      showMessage('App Settings saved successfully!');
    } catch (err) {
      console.error(err);
      showMessage('Failed to save app settings.', true);
    }
    setSaving(false);
  };

  const handleSaveCatalog = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'master_settings', 'catalog'), catalog);
      showMessage('Catalog Settings saved successfully!');
    } catch (err) {
      console.error(err);
      showMessage('Failed to save catalog.', true);
    }
    setSaving(false);
  };

  const handleSaveTimeSlots = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'master_settings', 'time_slots'), { slots: timeSlots });
      showMessage('Time Slots saved successfully!');
    } catch (err) {
      console.error(err);
      showMessage('Failed to save time slots.', true);
    }
    setSaving(false);
  };

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} /></div>;
  }

  return (
    <div className="animate-in" style={{ paddingBottom: '60px' }}>
      <h1 className="page-title">Master Controls</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Configure core app behavior. Changes instantly sync to the User App.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('app')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'app' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'app' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Settings size={18} /> App Configuration
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'catalog' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'catalog' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <List size={18} /> Categories & Services
        </button>
        <button 
          onClick={() => setActiveTab('times')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'times' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'times' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Clock size={18} /> Time Slots
        </button>
      </div>

      {message && (
        <div style={{ padding: '16px', background: message.includes('Failed') ? '#FEE2E2' : '#DCFCE7', color: message.includes('Failed') ? '#991B1B' : '#166534', borderRadius: '8px', marginBottom: '24px', fontWeight: '500' }}>
          {message}
        </div>
      )}

      {/* App Configuration Tab */}
      {activeTab === 'app' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>General Settings</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Accept New Orders</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Toggle off if you are at capacity. Users cannot place new orders.</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={appConfig.acceptOrders}
                    onChange={(e) => setAppConfig({...appConfig, acceptOrders: e.target.checked})}
                    style={{ width: '24px', height: '24px', accentColor: 'var(--primary)' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Base Delivery Fee (₹)</label>
                <input 
                  type="number" 
                  value={appConfig.baseDeliveryFee}
                  onChange={(e) => setAppConfig({...appConfig, baseDeliveryFee: Number(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Express Delivery Fee (₹)</label>
                <input 
                  type="number" 
                  value={appConfig.expressDeliveryFee}
                  onChange={(e) => setAppConfig({...appConfig, expressDeliveryFee: Number(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Tax Percentage (%)</label>
                <input 
                  type="number" 
                  value={appConfig.taxPercentage}
                  onChange={(e) => setAppConfig({...appConfig, taxPercentage: Number(e.target.value)})}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleSaveAppConfig} disabled={saving} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />} Save App Settings
            </button>
          </div>
        </div>
      )}

      {/* Catalog Manager Tab */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Item Categories</h2>
              <button 
                onClick={() => {
                  const val = prompt('Enter new category name:');
                  if (val) setCatalog({...catalog, categories: [...catalog.categories, val]});
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {catalog.categories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <span>{cat}</span>
                  <button onClick={() => setCatalog({...catalog, categories: catalog.categories.filter((_, i) => i !== idx)})} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Service Types</h2>
              <button 
                onClick={() => {
                  const val = prompt('Enter new service type:');
                  if (val) setCatalog({...catalog, services: [...catalog.services, val]});
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {catalog.services.map((srv, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <span>{srv}</span>
                  <button onClick={() => setCatalog({...catalog, services: catalog.services.filter((_, i) => i !== idx)})} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSaveCatalog} disabled={saving} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />} Save Catalog Data
            </button>
          </div>
        </div>
      )}

      {/* Time Slots Tab */}
      {activeTab === 'times' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>Pickup & Delivery Time Slots</h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Define the windows available for customers to choose.</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                const val = prompt('Enter new time slot (e.g. 7 PM - 9 PM):');
                if (val) setTimeSlots([...timeSlots, val]);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> Add Time Slot
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
            {timeSlots.map((slot, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}>
                  <Clock size={18} color="var(--primary)" /> {slot}
                </div>
                <button onClick={() => setTimeSlots(timeSlots.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {timeSlots.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No time slots available.</p>}
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" onClick={handleSaveTimeSlots} disabled={saving} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />} Save Time Slots
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
