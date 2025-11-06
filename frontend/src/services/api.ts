// src/services/api.ts
import type { Book, SaveBook } from '../types';
import { mockBooks } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = false; // ✅ Ahora conectado al backend real

export const apiService = {
    // Obtener catálogo general de libros
    async getBooks(page: number = 1): Promise<Book[]> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return mockBooks;
        }

        try {
            const response = await fetch(`${API_URL}/books/catalog?page=${page}`);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            return mockBooks; // Fallback a mock data
        }
    },

    // Buscar libros por título y opcionalmente por género
    async searchBooks(query: string, genre?: string, page: number = 1): Promise<Book[]> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!query.trim()) return mockBooks;
            const searchTerm = query.toLowerCase();
            return mockBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.genre?.toLowerCase().includes(searchTerm) ||
                book.description?.toLowerCase().includes(searchTerm)
            );
        }

        try {
            let url = `${API_URL}/books/search?title=${encodeURIComponent(query)}&page=${page}`;
            if (genre) {
                url += `&genre=${encodeURIComponent(genre)}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Error searching books:', error);
            return [];
        }
    },

    // Obtener géneros disponibles
    async getGenres(): Promise<string[]> {
        if (USE_MOCK_DATA) {
            return ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery'];
        }

        try {
            const response = await fetch(`${API_URL}/books/genres`);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Error fetching genres:', error);
            return [];
        }
    },

    // Obtener rating de un libro
    async getRating(bookId: string): Promise<any> {
        if (USE_MOCK_DATA) {
            return { rating: 4.5, reviews: 120 };
        }

        try {
            const response = await fetch(`${API_URL}/books/rating?id=${encodeURIComponent(bookId)}`);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Error fetching rating:', error);
            return null;
        }
    },

    // Guardar libro favorito (requiere autenticación)
    async saveBook(bookData: SaveBook, token: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/books/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error al guardar libro');
            }
            return await response.json();
        } catch (error) {
            console.error('Error saving book:', error);
            throw error;
        }
    },

    // Obtener libros favoritos del usuario (requiere autenticación)
    async getFavorites(token: string): Promise<SaveBook[]> {
        try {
            const response = await fetch(`${API_URL}/books/get_favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error al obtener favoritos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    },

    // Autenticación - Registro
    async register(email: string, password: string, full_name: string, preferences: Record<string, any> = {}): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, full_name, preferences })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error en registro');
            }
            return await response.json();
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    },

    // Autenticación - Login
    async login(email: string, password: string): Promise<{ token: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Credenciales inválidas');
            }
            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
};
