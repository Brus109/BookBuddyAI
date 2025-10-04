// src/components/StarRating.tsx - CREAR NUEVO ARCHIVO
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, onRatingChange, editable = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  // Tamaños para los stars
  const sizeStyles = {
    sm: { fontSize: '1.2rem', gap: '2px' },
    md: { fontSize: '1.8rem', gap: '4px' },
    lg: { fontSize: '2.4rem', gap: '6px' }
  };

  const handleClick = (newRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (editable) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  // Rating a mostrar (hover tiene prioridad)
  const displayRating = hoverRating || rating;

  return (
    <div 
      className="star-rating"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: sizeStyles[size].gap 
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: sizeStyles[size].fontSize,
            cursor: editable ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            filter: star <= displayRating ? 'none' : 'grayscale(1) opacity(0.7)'
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onKeyDown={(e) => {
            if (editable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleClick(star);
            }
          }}
          tabIndex={editable ? 0 : -1}
        >
          ⭐
        </span>
      ))}
      
      {rating > 0 && !editable && (
        <span style={{ 
          marginLeft: '10px', 
          fontWeight: '600', 
          color: '#666',
          fontSize: '0.9em'
        }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}