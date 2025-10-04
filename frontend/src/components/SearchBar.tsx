// src/components/SearchBar.tsx - OPTIMIZADO
import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Book } from '../types';

interface SearchBarProps {
  onSearchResults: (books: Book[]) => void;
}

export function SearchBar({ onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // ✅ USAR useCallback
  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      onSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const results = await apiService.searchBooks(query);
      onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [query, onSearchResults]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar libros por título o autor..."
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} disabled={searching}>
        {searching ? 'Buscando...' : '🔍 Buscar'}
      </button>
    </div>
  );
}