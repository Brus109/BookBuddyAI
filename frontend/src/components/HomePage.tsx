// src/components/HomePage.tsx - CORREGIDO
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookList } from './BookList';
import { SearchBar } from './SearchBar';
import { BookFilters } from './BookFilters';
import type { Book } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [hasSearch, setHasSearch] = useState(false); // ✅ Nuevo estado para controlar búsqueda

  const navigateTo = useCallback((path: string) => {
    try {
      navigate(path);
    } catch (error) {
      window.location.href = path;
    }
  }, [navigate]);

  const handleSearchResults = useCallback((results: Book[]) => {
    console.log('🔍 Resultados de búsqueda:', results.length);
    setSearchResults(results);
    setFilteredBooks(results);
    setHasSearch(results.length > 0); // ✅ Mostrar filtros solo si NO hay búsqueda
  }, []);

  const handleFilterChange = useCallback((filtered: Book[]) => {
    console.log('🎯 Libros filtrados:', filtered.length);
    setFilteredBooks(filtered);
  }, []);

  const goToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo('/favorites');
  };

  // ✅ Determinar qué libros mostrar
  const booksToShow = hasSearch ? filteredBooks : (filteredBooks.length > 0 ? filteredBooks : undefined);

  return (
    <div>
      <header className="app-header">
        <div className="header-content">
          <h1>BookBuddyAI 📚</h1>
          <p>Descubre tu próximo libro favorito con inteligencia artificial</p>
        </div>
        
        <nav className="header-nav">
          <button className="nav-btn" onClick={goToFavorites}>
            ❤️ Favoritos
          </button>
        </nav>
      </header>

      <SearchBar onSearchResults={handleSearchResults} />
      
      {/* ✅ MOSTRAR FILTROS SOLO CUANDO NO HAY BÚSQUEDA */}
      {!hasSearch && (
        <BookFilters 
          books={[]} // ✅ Pasar array vacío o los libros iniciales si los tienes
          onFilterChange={handleFilterChange} 
        />
      )}
      
      {/* ✅ MOSTRAR MENSAJE CUANDO HAY BÚSQUEDA PERO NO RESULTADOS */}
      {hasSearch && searchResults.length === 0 && (
        <div className="search-no-results">
          <p>🔍 No se encontraron libros para tu búsqueda</p>
          <button 
            onClick={() => {
              setSearchResults([]);
              setFilteredBooks([]);
              setHasSearch(false);
            }}
            className="clear-search-btn"
          >
            📚 Ver todos los libros
          </button>
        </div>
      )}
      
      <BookList books={booksToShow} />
    </div>
  );
}