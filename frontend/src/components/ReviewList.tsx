// src/components/ReviewList.tsx - CREAR NUEVO ARCHIVO
import { StarRating } from './StarRating';
import type { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
  onReviewDelete?: (reviewId: string) => void;
}

export function ReviewList({ reviews, onReviewDelete }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (reviews.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#6c757d', 
        fontStyle: 'italic' 
      }}>
        <p>📝 Sé el primero en escribir una reseña</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.5rem' }}>
        💬 Reseñas de lectores ({reviews.length})
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviews.map((review) => (
          <div key={review.id} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'relative',
            borderLeft: '4px solid #667eea'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                  {review.userName}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  {formatDate(review.date)}
                </span>
              </div>
              
              <StarRating rating={review.rating} size="sm" />
            </div>
            
            {review.comment && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: 0, lineHeight: '1.6', color: '#555' }}>
                  {review.comment}
                </p>
              </div>
            )}

            {onReviewDelete && (
              <button 
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: '0.7',
                  transition: 'opacity 0.3s'
                }}
                onClick={() => onReviewDelete(review.id)}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                title="Eliminar reseña"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}