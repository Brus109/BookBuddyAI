// src/components/FavoritesPage.tsx - Con autenticación
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { BookList } from './BookList';
import { AuthModal } from './AuthModal';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const goToHome = () => {
    navigate('/');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      const confirmed = window.confirm('¿Deseas cerrar sesión?');
      if (confirmed) {
        logout();
      }
    } else {
      setShowAuthModal(true);
    }
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
          {isAuthenticated && user && (
            <div className="user-info">
              <span className="user-greeting">👋 Hola, {user.name}</span>
            </div>
          )}
          
          <button className="nav-btn active">
            ❤️ Favoritos
          </button>
          
          <button className="nav-btn" onClick={handleAuthClick}>
            {isAuthenticated ? '🚪 Cerrar Sesión' : '🔑 Iniciar Sesión'}
          </button>
        </nav>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

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