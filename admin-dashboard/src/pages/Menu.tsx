import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Men', icon: '', color: '#334155' });
  const [isAdding, setIsAdding] = useState(false);

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'serviceItems'), {
        ...newItem,
        price: Number(newItem.price)
      });
      setShowAddModal(false);
      setNewItem({ name: '', price: '', category: 'Men', icon: '', color: '#334155' });
      fetchItems();
    } catch (err) {
      console.error("Error adding item:", err);
    }
    setIsAdding(false);
  };

  const handleNameChange = (name: string) => {
    let icon = newItem.icon;
    let color = newItem.color;
    let category = newItem.category;
    const lowerName = name.toLowerCase();

    if (lowerName.includes('pant') || lowerName.includes('jean') || lowerName.includes('trouser')) {
      icon = '👖'; color = '#EEF2FF'; category = 'Men';
    } else if (lowerName.includes('shirt') || lowerName.includes('t-shirt') || lowerName.includes('top')) {
      icon = '👕'; color = '#F0F9FF'; category = 'Men';
    } else if (lowerName.includes('suit') || lowerName.includes('tie') || lowerName.includes('blazer')) {
      icon = '👔'; color = '#ECFDF5'; category = 'Men';
    } else if (lowerName.includes('saree')) {
      icon = '🥻'; color = '#FDF2F8'; category = 'Women';
    } else if (lowerName.includes('dress') || lowerName.includes('frock') || lowerName.includes('chudidhar') || lowerName.includes('lehanga')) {
      icon = '👗'; color = '#FDF4FF'; category = 'Women';
    } else if (lowerName.includes('towel')) {
      icon = '🧻'; color = '#F8FAFC'; category = 'Household';
    } else if (lowerName.includes('blanket') || lowerName.includes('bed') || lowerName.includes('pillow') || lowerName.includes('cover')) {
      icon = '🛏️'; color = '#F7FEE7'; category = 'Household';
    } else if (lowerName.includes('kid') || lowerName.includes('toy')) {
      icon = '🧸'; color = '#FFFBEB'; category = 'Kids';
    } else if (lowerName.includes('shoe') || lowerName.includes('sneaker')) {
      icon = '👟'; color = '#F1F5F9';
    } else if (lowerName.includes('jacket') || lowerName.includes('coat') || lowerName.includes('hoodie')) {
      icon = '🧥'; color = '#FEF2F2';
    } else if (lowerName.includes('sock')) {
      icon = '🧦'; color = '#FFF7ED';
    }

    setNewItem(prev => ({
      ...prev,
      name,
      icon,
      color,
      category
    }));
  };

  const categories = ['All', 'Men', 'Women', 'Kids', 'Household'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

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
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                backgroundColor: activeCategory === category ? 'var(--primary)' : 'var(--bg-card)',
                color: activeCategory === category ? 'var(--bg-dark)' : 'var(--text-muted)',
                boxShadow: activeCategory === category ? '0 4px 12px rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                minWidth: 'max-content'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      
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
            {filteredItems.map((item, index) => (
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
            {filteredItems.length === 0 && items.length > 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No items found in the {activeCategory} category.
                </td>
              </tr>
            )}
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

      {/* Add Item Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-in" style={{ width: '450px', maxWidth: '90%', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input type="text" required className="input-field" value={newItem.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Jeans" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" required className="input-field" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="e.g. 20" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="input-field" style={{ appearance: 'none' }} value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Household">Household</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Emoji Icon</label>
                  <input type="text" required className="input-field" value={newItem.icon} onChange={e => setNewItem({...newItem, icon: e.target.value})} placeholder="👖" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Icon Background</label>
                  <input type="color" className="input-field" style={{ padding: '4px', height: '52px', cursor: 'pointer' }} value={newItem.color} onChange={e => setNewItem({...newItem, color: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn-danger" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={isAdding}>
                  {isAdding ? <Loader2 className="spin" size={16} /> : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
