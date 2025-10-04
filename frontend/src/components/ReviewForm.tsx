// src/components/ReviewForm.tsx - CREAR NUEVO ARCHIVO
import { useState } from 'react';
import { StarRating } from './StarRating';
import type { Book } from '../types';

interface ReviewFormProps {
  book: Book;
  onReviewSubmitted: (reviewData: { userName: string; rating: number; comment: string }) => void;
}

export function ReviewForm({ book, onReviewSubmitted }: ReviewFormProps) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim() || rating === 0) {
      alert('Por favor ingresa tu nombre y una calificación');
      return;
    }

    setIsSubmitting(true);

    // Simular envío
    setTimeout(() => {
      onReviewSubmitted({ userName, rating, comment });
      
      // Limpiar formulario
      setUserName('');
      setRating(0);
      setComment('');
      setIsSubmitting(false);
    }, 500);
  };

  const canSubmit = userName.trim() && rating > 0;

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '30px',
      borderRadius: '15px',
      margin: '40px 0'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.5rem' }}>
        📝 Escribe tu reseña para "{book.title}"
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#495057' }} htmlFor="userName">
            Tu nombre *
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="¿Cómo te llamas?"
            required
            style={{
              padding: '12px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#495057' }}>
            Tu calificación *
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating} 
            editable={true} 
            size="lg" 
          />
          <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
            {rating === 0 && 'Selecciona de 1 a 5 estrellas'}
            {rating > 0 && `${rating} estrella${rating > 1 ? 's' : ''}`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#495057' }} htmlFor="comment">
            Tu reseña (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció este libro? Comparte tu opinión..."
            rows={4}
            style={{
              padding: '12px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.3s',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        <button 
          type="submit" 
          style={{
            background: canSubmit ? 'linear-gradient(135deg, #28a745, #20c997)' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            alignSelf: 'flex-start',
            opacity: isSubmitting ? '0.7' : '1'
          }}
          disabled={!canSubmit || isSubmitting}
          onMouseEnter={(e) => {
            if (canSubmit) e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            if (canSubmit) e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isSubmitting ? 'Enviando...' : '📤 Publicar Reseña'}
        </button>
      </form>
    </div>
  );
}