// src/components/BookDetailModal.tsx
import { FavoriteButton } from './FavoriteButton';
import type { Book } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailModal({ book, isOpen, onClose }: BookDetailModalProps) {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <FavoriteButton book={book} />
          <h2>{book.title}</h2>
        </div>

        <div className="modal-body">
          <div className="book-info">
            <p><strong>Autor:</strong> {book.author}</p>
            {book.genre && <p><strong>Género:</strong> {book.genre}</p>}
            {book.published_date && <p><strong>Fecha de publicación:</strong> {book.published_date}</p>}
          </div>

          {book.description && (
            <div className="book-description">
              <h4>Descripción</h4>
              <p>{book.description}</p>
            </div>
          )}

          {book.cover_url && (
            <div className="book-cover">
              <img src={book.cover_url} alt={`Portada de ${book.title}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}