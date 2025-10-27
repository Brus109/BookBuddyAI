// src/hooks/useFavorites.ts - Conectado al backend
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Book, SaveBook } from '../types';

export function useFavorites() {
    const { token, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<SaveBook[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar favoritos del backend si está autenticado
    useEffect(() => {
        if (isAuthenticated && token) {
            loadFavorites();
        } else {
            // Si no está autenticado, usar localStorage como fallback
            const saved = localStorage.getItem('bookbuddy-favorites');
            if (saved) {
                try {
                    setFavorites(JSON.parse(saved));
                } catch (error) {
                    console.error('Error loading favorites:', error);
                    setFavorites([]);
                }
            }
        }
    }, [isAuthenticated, token]);

    const loadFavorites = async () => {
        if (!token) return;
        
        setIsLoading(true);
        try {
            const data = await apiService.getFavorites(token);
            setFavorites(data);
        } catch (error) {
            console.error('Error loading favorites from backend:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addFavorite = async (book: Book, status: string = 'want_to_read', rating?: number, review?: string) => {
        if (!book.workId) {
            console.error('Book must have workId to be saved');
            return;
        }

        const saveData: SaveBook = {
            book_id: book.workId,
            status,
            rating,
            review
        };

        if (isAuthenticated && token) {
            // Guardar en backend
            try {
                await apiService.saveBook(saveData, token);
                await loadFavorites(); // Recargar favoritos
            } catch (error) {
                console.error('Error saving to backend:', error);
                // Fallback a localStorage
                const updated = [...favorites, saveData];
                setFavorites(updated);
                localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
            }
        } else {
            // Guardar solo en localStorage si no está autenticado
            const updated = [...favorites, saveData];
            setFavorites(updated);
            localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
        }
    };

    const removeFavorite = async (bookId: string) => {
        // TODO: Implementar endpoint DELETE en backend
        const updated = favorites.filter(fav => fav.book_id !== bookId);
        setFavorites(updated);
        
        if (!isAuthenticated) {
            localStorage.setItem('bookbuddy-favorites', JSON.stringify(updated));
        }
    };

    const isFavorite = (bookId: string) =>
        favorites.some(fav => fav.book_id === bookId);

    return { 
        favorites, 
        addFavorite, 
        removeFavorite, 
        isFavorite,
        isLoading,
        refreshFavorites: loadFavorites
    };
}
