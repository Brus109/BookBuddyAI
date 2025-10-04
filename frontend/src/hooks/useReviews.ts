// src/hooks/useReviews.ts - ADAPTADO A TUS TIPOS
import { useState, useEffect } from 'react';
import type { Review, Book } from '../types';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Cargar reseñas al inicializar
  useEffect(() => {
    const savedReviews = localStorage.getItem('bookbuddy-reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambien las reseñas
  useEffect(() => {
    localStorage.setItem('bookbuddy-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (bookId: number, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      bookId,              // ✅ Usa tu book.id (number)
      userId: 'anonymous', 
      userName,
      rating,
      comment,
      date: new Date().toISOString()
    };

    setReviews(prev => [...prev, newReview]);
    return newReview;
  };

  const getBookReviews = (bookId: number): Review[] => {
    return reviews.filter(review => review.bookId === bookId);
  };

  const getBookAverageRating = (bookId: number): number => {
    const bookReviews = getBookReviews(bookId);
    if (bookReviews.length === 0) return 0;
    
    const sum = bookReviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / bookReviews.length) * 10) / 10;
  };

  const getBookReviewCount = (bookId: number): number => {
    return getBookReviews(bookId).length;
  };

  // ✅ Función para actualizar el rating de un libro en el mock data
  const updateBookRating = (books: Book[], bookId: number): Book[] => {
    return books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          rating: getBookAverageRating(bookId),
          reviews: getBookReviewCount(bookId)
        };
      }
      return book;
    });
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  return {
    reviews,
    addReview,
    getBookReviews,
    getBookAverageRating,
    getBookReviewCount,
    updateBookRating,
    deleteReview
  };
}