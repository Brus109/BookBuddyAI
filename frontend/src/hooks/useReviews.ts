// src/hooks/useReviews.ts - Actualizado con workId y mejor persistencia
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Review, Book } from '../types';

export function useReviews() {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar reseñas al inicializar
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    try {
      const savedReviews = localStorage.getItem('bookbuddy-reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    }
  };

  // Guardar en localStorage cuando cambien las reseñas
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('bookbuddy-reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  // Agregar reseña (usa workId ahora)
  const addReview = (bookId: string, userName: string, rating: number, comment: string) => {
    if (!bookId) {
      console.error('bookId (workId) es requerido para agregar reseña');
      return null;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      bookId,              // workId del libro
      userId: user?.id || 'anonymous', 
      userName: userName || user?.name || 'Anónimo',
      rating: Math.max(1, Math.min(5, rating)), // Asegurar que está entre 1-5
      comment,
      date: new Date().toISOString()
    };

    setReviews(prev => [...prev, newReview]);
    
    console.log('✅ Reseña agregada:', newReview);
    return newReview;
  };

  // Obtener reseñas de un libro (por workId)
  const getBookReviews = (bookId: string): Review[] => {
    if (!bookId) return [];
    return reviews.filter(review => review.bookId === bookId);
  };

  // Calcular rating promedio de un libro
  const getBookAverageRating = (bookId: string): number => {
    const bookReviews = getBookReviews(bookId);
    if (bookReviews.length === 0) return 0;
    
    const sum = bookReviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / bookReviews.length) * 10) / 10;
  };

  // Obtener cantidad de reseñas de un libro
  const getBookReviewCount = (bookId: string): number => {
    return getBookReviews(bookId).length;
  };

  // Actualizar rating de un libro en la lista
  const updateBookRating = (books: Book[], bookId: string): Book[] => {
    return books.map(book => {
      if (book.workId === bookId) {
        return {
          ...book,
          rating: getBookAverageRating(bookId),
          reviews: getBookReviewCount(bookId)
        };
      }
      return book;
    });
  };

  // Eliminar reseña
  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    console.log('🗑️ Reseña eliminada:', reviewId);
  };

  // Editar reseña
  const editReview = (reviewId: string, rating: number, comment: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          rating: Math.max(1, Math.min(5, rating)),
          comment,
          date: new Date().toISOString() // Actualizar fecha de modificación
        };
      }
      return review;
    }));
    console.log('✏️ Reseña editada:', reviewId);
  };

  // Verificar si el usuario ya reseñó un libro
  const hasUserReviewedBook = (bookId: string): boolean => {
    if (!user) return false;
    return reviews.some(review => 
      review.bookId === bookId && review.userId === user.id
    );
  };

  // Obtener reseña del usuario para un libro específico
  const getUserReviewForBook = (bookId: string): Review | undefined => {
    if (!user) return undefined;
    return reviews.find(review => 
      review.bookId === bookId && review.userId === user.id
    );
  };

  return {
    reviews,
    addReview,
    getBookReviews,
    getBookAverageRating,
    getBookReviewCount,
    updateBookRating,
    deleteReview,
    editReview,
    hasUserReviewedBook,
    getUserReviewForBook,
    isLoading,
    refreshReviews: loadReviews
  };
}
