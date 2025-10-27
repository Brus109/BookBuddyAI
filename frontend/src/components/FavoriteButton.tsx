// src/components/FavoriteButton.tsx - CORREGIDO
import { useState, useEffect } from 'react';
import type { Book } from '../types';

interface FavoriteButtonProps {
    book: Book;
}

export function FavoriteButton({ book }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('bookbuddy-favorites') || '[]');
        setIsFavorite(favorites.some((fav: any) => fav.book_id === book.workId || fav.workId === book.workId));
    }, [book.workId]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!book.workId) {
            console.error('Book must have workId to be saved');
            return;
        }

        const favorites = JSON.parse(localStorage.getItem('bookbuddy-favorites') || '[]');

        if (isFavorite) {
            const updated = favorites.filter((fav: any) => 
                fav.book_id !== book.workId && fav.workId !== book.workId
            );
            localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
            setIsFavorite(false);
        } else {
            // Guardar en formato compatible con backend
            const saveData = {
                book_id: book.workId,
                status: 'want_to_read',
                ...book // Mantener datos del libro para visualización
            };
            const updated = [...favorites, saveData];
            localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
            setIsFavorite(true);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
            {isFavorite ? '❤️' : '🤍'}
        </button>
    );
}