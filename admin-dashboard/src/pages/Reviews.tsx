import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, MessageSquareHeart, Award } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: No orderBy if there's no index, but we can try sorting in memory.
    const q = query(collection(db, 'reviews'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let revData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort newest first
      revData.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setReviews(revData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="page-container animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquareHeart color="var(--primary)" /> Customer Sentiment Wall
          </h1>
          <p className="page-subtitle">Real-time feedback from your users.</p>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)', padding: '16px 24px', borderRadius: '16px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>Average Rating</span>
            <span style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1 }}>{averageRating}</span>
          </div>
          <Star size={40} fill="#FFF" color="#FFF" />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
          <MessageSquareHeart size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>No reviews yet</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>When customers submit reviews, they will appear here.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {reviews.map(review => (
            <div key={review.id} className="card" style={{ position: 'relative', overflow: 'hidden', padding: '24px' }}>
              {/* Gold border top for 5-star */}
              {review.rating === 5 && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #FFD700, #F59E0B)' }}></div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text)' }}>
                    {review.userName || 'Anonymous User'}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {review.createdAt ? new Date(review.createdAt.toMillis()).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                {review.rating === 5 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                    <Award size={12} /> TOP RATED
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    size={18} 
                    fill={star <= review.rating ? '#FFD700' : '#E2E8F0'} 
                    color={star <= review.rating ? '#FFD700' : '#E2E8F0'} 
                  />
                ))}
              </div>

              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>
                {review.title}
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                "{review.body}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
