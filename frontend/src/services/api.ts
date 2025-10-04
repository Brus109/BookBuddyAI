// src/services/api.ts - ACTUALIZADO
import type { Book } from '../types';
import { mockBooks } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté listo

export const apiService = {
    async getBooks(): Promise<Book[]> {
        if (USE_MOCK_DATA) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            return mockBooks;
        }

        try {
            const response = await fetch(`${API_URL}/books`);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            return mockBooks; // Fallback a mock data
        }
    },

    async searchBooks(query: string): Promise<Book[]> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!query.trim()) return mockBooks; // Si está vacío, devolver todos

            const searchTerm = query.toLowerCase();
            return mockBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.genre?.toLowerCase().includes(searchTerm) ||
                book.description?.toLowerCase().includes(searchTerm)
            );
        }

        try {
            const response = await fetch(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Error searching books:', error);
            return mockBooks.filter(book =>
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase())
            );
        }
    }
};