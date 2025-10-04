// src/components/BookDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useReviews } from '../hooks/useReviews';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import type { Book } from '../types';
import { FavoriteButton } from './FavoriteButton';

// 🎨 Estilos principales
const styles = {
    page: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        marginTop: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '3px solid #f8f9fa',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2c3e50',
        margin: '0',
        fontWeight: '700',
        lineHeight: '1.2',
    },
    author: {
        fontSize: '1.3rem',
        color: '#667eea',
        margin: '8px 0 0 0',
        fontWeight: '500',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '40px',
        alignItems: 'start',
    },
    backButton: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
    },
};

// 🔹 Header
interface HeaderProps {
    onHomeClick: () => void;
    onFavoritesClick: () => void;
}

function Header({ onHomeClick, onFavoritesClick }: HeaderProps) {
    return (
        <header className="app-header">
            <div className="header-content" onClick={onHomeClick}>
                <h1>BookBuddyAI 📚</h1>
                <p>Descubre tu próximo libro favorito con inteligencia artificial</p>
            </div>
            <nav className="header-nav">
                <button className="nav-btn" onClick={onFavoritesClick}>
                    ❤️ Favoritos
                </button>
            </nav>
        </header>
    );
}

// ✅ Componente SimilarBooks (una sola vez)
interface SimilarBooksProps {
    books: Book[];
    onBookClick: (bookId: number) => void;
}

function SimilarBooks({ books, onBookClick }: SimilarBooksProps) {
    if (books.length === 0) return null;

    return (
        <div style={{
            marginTop: '50px',
            padding: '30px',
            background: '#f8f9fa',
            borderRadius: '15px',
            border: '1px solid #e9ecef'
        }}>
            <h3 style={{
                margin: '0 0 25px 0',
                color: '#2c3e50',
                fontSize: '1.5rem',
                textAlign: 'center'
            }}>
                📚 Te podría gustar también
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {books.map(book => (
                    <div
                        key={book.id}
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            border: '2px solid transparent'
                        }}
                        onClick={() => onBookClick(book.id)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.borderColor = '#667eea';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '12px' }}>
                            {book.cover_url ? (
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    style={{
                                        width: '60px',
                                        height: '80px',
                                        borderRadius: '6px',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '60px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6c757d',
                                    fontSize: '1.5rem'
                                }}>
                                    📖
                                </div>
                            )}

                            <div style={{ flex: 1 }}>
                                <h4 style={{
                                    margin: '0 0 5px 0',
                                    color: '#2c3e50',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.3'
                                }}>
                                    {book.title}
                                </h4>
                                <p style={{
                                    margin: '0',
                                    color: '#667eea',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    {book.author}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {book.genre && (
                                <span style={{
                                    background: '#e3f2fd',
                                    color: '#1976d2',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {book.genre}
                                </span>
                            )}

                            {book.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ fontSize: '0.9rem' }}>⭐</span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#f39c12'
                                    }}>
                                        {book.rating}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [similarBooks, setSimilarBooks] = useState<Book[]>([]);

    const { getBookReviews, addReview, getBookAverageRating, getBookReviewCount } = useReviews();
    const bookReviews = book ? getBookReviews(book.id) : [];
    const realRating = book ? getBookAverageRating(book.id) : 0;
    const realReviewCount = book ? getBookReviewCount(book.id) : 0;

    useEffect(() => {
        const loadBookData = async () => {
            if (!id) {
                setBook(null);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const books = await apiService.getBooks();
                const foundBook = books.find(b => b.id === parseInt(id));
                setBook(foundBook || null);

                // Cargar libros similares
                if (foundBook) {
                    const filtered = books.filter(
                        b => b.genre === foundBook.genre && b.id !== foundBook.id
                    );
                    setSimilarBooks(filtered);
                }
            } catch (error) {
                console.error('Error loading book:', error);
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        loadBookData();
    }, [id]);

    const handleReviewSubmitted = (reviewData: { userName: string; rating: number; comment: string }) => {
        if (!book) return;
        addReview(book.id, reviewData.userName, reviewData.rating, reviewData.comment);
    };

    const handleBack = () => navigate(-1);
    const goToHome = () => navigate('/');
    const goToFavorites = () => navigate('/favorites');

    if (loading) {
        return (
            <div className="app">
                <Header onHomeClick={goToHome} onFavoritesClick={goToFavorites} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando libro...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="app">
                <Header onHomeClick={goToHome} onFavoritesClick={goToFavorites} />
                <div className="error-container">
                    <div className="error-icon">📚</div>
                    <h2>Libro no encontrado</h2>
                    <p>El libro que buscas no existe o no está disponible.</p>
                    <button onClick={handleBack} className="back-btn">
                        ← Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Header onHomeClick={goToHome} onFavoritesClick={goToFavorites} />

            <div style={styles.page}>
                <button onClick={handleBack} style={styles.backButton}>
                    ← Volver atrás
                </button>

                <div style={styles.container}>
                    {/* 🌟 Cabecera */}
                    <div style={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '25px', flex: 1 }}>
                            <FavoriteButton book={book} />
                            <div style={{ flex: 1 }}>
                                <h1 style={styles.title}>{book.title}</h1>
                                <p style={styles.author}>por <strong>{book.author}</strong></p>

                                {/* Chips */}
                                <div className="chip-container">
                                    {book.genre && (
                                        <span className="chip blue-chip animate-chip">🏷️ {book.genre}</span>
                                    )}
                                    {book.published_date && (
                                        <span className="chip orange-chip animate-chip">📅 {book.published_date}</span>
                                    )}
                                    {realReviewCount > 0 && (
                                        <span className="chip green-chip animate-chip">
                                            <span className="star-bounce">⭐</span> {realRating.toFixed(1)} ({realReviewCount} reseñas)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📖 Contenido principal */}
                    <div style={styles.content}>
                        {/* Portada */}
                        <div style={{ textAlign: 'center' }}>
                            <div className="cover-box">
                                {book.cover_url ? (
                                    <img src={book.cover_url} alt={`Portada de ${book.title}`} className="book-cover" />
                                ) : (
                                    <div className="cover-placeholder">
                                        📖
                                        <p>Portada no disponible</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información */}
                        <div>
                            <div className="info-card synopsis-card">
                                <h2>📖 Descripción</h2>
                                <p>{book.description || 'No hay sinopsis disponible para este libro.'}</p>
                            </div>

                            <div className="info-card">
                                <h2>📋 Información del Libro</h2>
                                <div className="info-list">
                                    <div>📌 <span>Título:</span> {book.title}</div>
                                    <div>✍️ <span>Autor:</span> {book.author}</div>
                                    {book.genre && <div>📚 <span>Género:</span> {book.genre}</div>}
                                    {book.published_date && <div>📅 <span>Año:</span> {book.published_date}</div>}
                                </div>
                            </div>

                            {realReviewCount > 0 && (
                                <div className="info-card rating-card">
                                    <h2>⭐ Calificación de la Comunidad</h2>
                                    <div className="rating-box">
                                        <div className="stars">{'⭐'.repeat(Math.floor(realRating))}</div>
                                        <div className="score">{realRating.toFixed(1)} / 5.0</div>
                                        <small>Basado en {realReviewCount} reseña{realReviewCount > 1 ? 's' : ''}</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reseñas */}
                    <div className="reviews-section">
                        <ReviewForm book={book} onReviewSubmitted={handleReviewSubmitted} />
                        <ReviewList reviews={bookReviews} />
                    </div>

                    {/* Similar Books */}
                    <SimilarBooks
                        books={similarBooks}
                        onBookClick={(bookId) => navigate(`/book/${bookId}`)}
                    />
                </div>
            </div>
        </div>
    );
}
