// src/types/index.ts - MANTENER TU ESTRUCTURA + AGREGAR RESEÑAS
export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  cover_url?: string;
  genre?: string;
  published_date?: string;
  rating?: number;        // ✅ Rating promedio del libro
  reviews?: number;       // ✅ Cantidad total de reseñas
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

// ✅ NUEVOS TIPOS PARA RESEÑAS
export interface Review {
  id: string;
  bookId: number;        // ✅ Relación con tu Book.id (number)
  userId: string;
  userName: string;
  rating: number;        // ✅ Rating individual de esta reseña (1-5)
  comment: string;
  date: string;
}

export interface BookWithReviews extends Book {
  userReviews?: Review[]; // ✅ Reseñas específicas de usuarios
  averageRating?: number; // ✅ Calculado dinámicamente
  reviewCount?: number;   // ✅ Calculado dinámicamente
}