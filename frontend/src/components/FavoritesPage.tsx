// src/components/FavoritesPage.tsx - VERSIÓN CORREGIDA
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { BookList } from './BookList';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Header en Favorites también */}
      <header className="app-header">
        <div className="header-content" onClick={goToHome}>
          <h1>BookBuddyAI 📚</h1>
          <p>Descubre tu próximo libro favorito con inteligencia artificial</p>
        </div>
        
        <nav className="header-nav">
          <button className="nav-btn active">
            ❤️ Favoritos
          </button>
        </nav>
      </header>

      <div className="favorites-page">
        <h2 className="page-title">❤️ Mis Libros Favoritos ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <p>📚 Aún no tienes libros favoritos</p>
            <p>Haz clic en el corazón de cualquier libro para agregarlo a favoritos</p>
          </div>
        ) : (
          <BookList books={favorites} />
        )}
      </div>
    </div>
  );
}