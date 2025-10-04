// src/hooks/useFavorites.ts - CORREGIDO
import { useState, useEffect } from 'react';
import type { Book } from '../types';

export function useFavorites() {
    const [favorites, setFavorites] = useState<Book[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('bookbuddy-favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading favorites:', error);
                setFavorites([]);
            }
        }
    }, []);

    const addFavorite = (book: Book) => {
        const updated = [...favorites, book];
        setFavorites(updated);
        localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
    };

    const removeFavorite = (bookId: number) => {
        const updated = favorites.filter(book => book.id !== bookId);
        setFavorites(updated);
        localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
    };

    const isFavorite = (bookId: number) =>
        favorites.some(book => book.id === bookId);

    return { favorites, addFavorite, removeFavorite, isFavorite };
}