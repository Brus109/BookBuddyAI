// src/components/BookFilters.tsx - MEJORADO
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api'; // ✅ Importar para obtener libros
import type { Book } from '../types';

interface BookFiltersProps {
  books: Book[];
  onFilterChange: (filteredBooks: Book[]) => void;
}

type FilterType = 'todos' | 'fantasia' | 'ficcion' | 'programacion' | 'clasicos' | 'romance';

export function BookFilters({ books, onFilterChange }: BookFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [allBooks, setAllBooks] = useState<Book[]>([]); // ✅ Estado para todos los libros

  // ✅ Cargar libros cuando el componente se monta
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await apiService.getBooks();
        setAllBooks(booksData);
        onFilterChange(booksData); // ✅ Mostrar todos inicialmente
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    loadBooks();
  }, [onFilterChange]);

  const filterBooks = useCallback(() => {
    if (activeFilter === 'todos') {
      console.log('✅ Mostrando TODOS los libros');
      onFilterChange(allBooks);
      return;
    }

    const filtered = allBooks.filter(book => {
      if (!book.genre) return false;
      
      const genreLower = book.genre.toLowerCase();
      
      switch (activeFilter) {
        case 'fantasia':
          return genreLower.includes('fantas');
        case 'ficcion':
          return genreLower.includes('ficción') || genreLower.includes('ficcion') || genreLower.includes('ciencia');
        case 'programacion':
          return genreLower.includes('programación') || genreLower.includes('programacion');
        case 'clasicos':
          return genreLower.includes('clásicos') || genreLower.includes('clasicos');
        case 'romance':
          return genreLower.includes('romance');
        default:
          return true;
      }
    });

    console.log(`🎯 Filtro "${activeFilter}" aplicado: ${filtered.length} libros`);
    onFilterChange(filtered);
  }, [activeFilter, allBooks, onFilterChange]);

  useEffect(() => {
    if (allBooks.length > 0) {
      filterBooks();
    }
  }, [filterBooks, allBooks.length]);

  const handleFilterClick = (filterKey: FilterType) => {
    setActiveFilter(filterKey);
  };

  const filters = [
    { key: 'todos', label: 'Todos los libros', emoji: '📚' },
    { key: 'fantasia', label: 'Fantasía', emoji: '🧙‍♂️' },
    { key: 'ficcion', label: 'Ciencia Ficción', emoji: '🚀' },
    { key: 'programacion', label: 'Programación', emoji: '💻' },
    { key: 'clasicos', label: 'Clásicos', emoji: '🏛️' },
    { key: 'romance', label: 'Romance', emoji: '💕' }
  ];

  return (
    <div className="filters-container">
      <h3>🎯 Explorar por Categorías</h3>
      
      <div className="category-filters">
        {filters.map(({ key, label, emoji }) => (
          <button
            key={key}
            className={`category-btn ${activeFilter === key ? 'active' : ''}`}
            onClick={() => handleFilterClick(key as FilterType)}
          >
            <span className="emoji">{emoji}</span>
            <span className="label">{label}</span>
          </button>
        ))}
      </div>

      <div className="filters-info">
        <p>💡 <strong>Explora nuestra biblioteca</strong> - Haz una búsqueda específica arriba para encontrar libros exactos</p>
      </div>
    </div>
  );
}