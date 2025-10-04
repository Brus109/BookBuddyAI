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
        setIsFavorite(favorites.some((fav: Book) => fav.id === book.id));
    }, [book.id]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation(); // ✅ Prevenir que se abra el modal

        const favorites = JSON.parse(localStorage.getItem('bookbuddy-favorites') || '[]');

        if (isFavorite) {
            const updated = favorites.filter((fav: Book) => fav.id !== book.id);
            localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
            setIsFavorite(false);
        } else {
            const updated = [...favorites, book];
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