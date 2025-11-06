// src/types/index.ts - Tipos sincronizados con backend
export interface Book {
  workId?: string;        // ID del libro en OpenLibrary
  title: string;
  author?: string;        // Opcional según backend
  year?: number;          // Año de publicación
  cover?: string;         // URL de portada
  genre?: string;
  description?: string;
  rating?: number;        // Rating promedio del libro
  reviews?: number;       // Cantidad total de reseñas
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

// Tipos para reseñas y favoritos
export interface Review {
  id: string;
  bookId: string;        // workId del libro
  userId: string;
  userName: string;
  rating: number;        // Rating individual (1-5)
  comment: string;
  date: string;
}

// Tipo para guardar favoritos (backend schema)
export interface SaveBook {
  book_id: string;       // workId del libro
  status?: string;       // Estado: "reading", "completed", "want_to_read"
  rating?: number;       // Rating del usuario (1-5)
  review?: string;       // Reseña del usuario
}

export interface BookWithReviews extends Book {
  userReviews?: Review[]; // ✅ Reseñas específicas de usuarios
  averageRating?: number; // ✅ Calculado dinámicamente
  reviewCount?: number;   // ✅ Calculado dinámicamente
}