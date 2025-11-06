// src/components/BookList.tsx - CÓDIGO COMPLETO CORREGIDO
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types';
import { apiService } from '../services/api';
import { FavoriteButton } from './FavoriteButton';

interface BookListProps {
  books?: Book[];
}

export function BookList({ books }: BookListProps) {
  const [internalBooks, setInternalBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ FUNCIÓN FALLBACK PARA NAVEGACIÓN
  const navigateTo = (path: string) => {
    try {
      console.log('📞 Intentando navegar con React Router:', path);
      navigate(path);
    } catch (error) {
      console.log('🔄 Fallback a window.location');
      window.location.href = path;
    }
  };

  useEffect(() => {
    if (books && books.length > 0) {
      setInternalBooks(books);
      setLoading(false);
      return;
    }

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const booksData = await apiService.getBooks();
        setInternalBooks(booksData);
      } catch (err) {
        setError('Error cargando libros');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, [books]);

  const handleBookClick = (bookId: string) => {
    if (!bookId) {
      console.error('⚠️ No se puede navegar sin workId');
      return;
    }
    console.log('📖 Botón Ver Detalles clickeado - Libro:', bookId);
    navigateTo(`/book/${bookId}`);
  };

  if (loading) return <p className="loading">Cargando libros...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="book-list-container">
      <h2 className="book-list-title">Libros Disponibles ({internalBooks.length})</h2>
      
      <div className="book-list">
        {internalBooks.length === 0 ? (
          <p className="empty-state">No se encontraron libros</p>
        ) : (
          internalBooks.map(book => (
            <div key={book.workId || book.title} className="book-card">
              <div className="book-card-header">
                <div onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton book={book} />
                </div>
                <h3>{book.title}</h3>
              </div>
              
              <p className="author"><strong>Autor:</strong> {book.author}</p>
              
              {book.genre && (
                <p className="genre"><strong>Género:</strong> {book.genre}</p>
              )}
              
              {book.rating && (
                <div className="book-rating">
                  <span className="stars">⭐ {book.rating}/5</span>
                  <span className="reviews">({book.reviews} reseñas)</span>
                </div>
              )}
              
              {book.description && (
                <p className="description">{book.description.substring(0, 120)}...</p>
              )}
              
              {/* Botón para ver detalles */}
              <button 
                className="view-details-btn"
                onClick={() => handleBookClick(book.workId || '')}
              >
                📖 Ver detalles completos
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}