import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

const SEED_DATA = [
  { name: 'Pant', price: 10, icon: '👖', color: '#EEF2FF', category: 'Men' },
  { name: 'Shirt', price: 10, icon: '👕', color: '#F0F9FF', category: 'Men' },
  { name: 'White-Liquid Pair', price: 30, icon: '👔', color: '#ECFDF5', category: 'Men' },
  { name: 'Saree (Normal)', price: 30, icon: '🥻', color: '#FDF2F8', category: 'Women' },
  { name: 'Saree (Pattu/Silk)', price: 45, icon: '🥻', color: '#FFF1F2', category: 'Women' },
  { name: 'Chudidhar (Pair)', price: 10, icon: '👗', color: '#FDF4FF', category: 'Women' },
  { name: 'Lehanga (Pair)', price: 10, icon: '👗', color: '#FAF5FF', category: 'Women' },
  { name: 'Frock', price: 15, icon: '👗', color: '#F5F3FF', category: 'Women' },
  { name: 'Kids Item (Single)', price: 5, icon: '🧸', color: '#FFFBEB', category: 'Kids' },
  { name: 'Towel', price: 5, icon: '🧻', color: '#F8FAFC', category: 'Household' },
  { name: 'Blanket', price: 80, icon: '🛏️', color: '#F7FEE7', category: 'Household' },
];

export default function Menu() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'serviceItems'));
      const fetchedItems: any[] = [];
      snap.forEach(doc => {
        fetchedItems.push({ id: doc.id, ...doc.data() });
      });
      setItems(fetchedItems);
    } catch (err) {
      console.error("Error fetching items", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      for (const item of SEED_DATA) {
        await addDoc(collection(db, 'serviceItems'), item);
      }
      await fetchItems();
    } catch (err) {
      console.error("Error seeding DB", err);
    }
    setIsSeeding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, 'serviceItems', id));
      fetchItems();
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="var(--primary)" /></div>;

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Menu & Pricing</h1>
        {items.length === 0 ? (
          <button 
            className="btn btn-primary" 
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {isSeeding ? <Loader2 className="spin" size={16} /> : <Plus size={16} />}
            {isSeeding ? 'Seeding...' : 'Seed Database with Initial Data'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => alert("Add Item functionality coming soon!")} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>
      
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Item</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Category</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Price</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={`animate-in delay-${(index % 4) + 1}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: item.color || '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: '600' }}>₹{item.price}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginRight: 12 }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ marginBottom: 16 }}>No items in the menu database.</div>
                  <p style={{ fontSize: 13, maxWidth: 400, margin: '0 auto' }}>Click "Seed Database" above to automatically import the handwritten pricing list into Firebase.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
