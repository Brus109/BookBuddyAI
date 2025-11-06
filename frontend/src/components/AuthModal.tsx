import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        if (!fullName.trim()) {
          setError('El nombre completo es requerido');
          setLoading(false);
          return;
        }
        await register(email, password, fullName);
      }
      
      // Cerrar modal después de éxito
      onClose();
      
      // Limpiar formulario
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err: any) {
      setError(err.message || 'Error en autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-modal-header">
          <h2>📚 BookBuddyAI</h2>
          <p>Tu compañero inteligente de lectura</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
          >
            Registrarse
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="fullName">Nombre Completo</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
            {activeTab === 'register' && (
              <small>Mínimo 6 caracteres</small>
            )}
          </div>

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {activeTab === 'login' ? 'Iniciando...' : 'Registrando...'}
              </>
            ) : (
              activeTab === 'login' ? '🔐 Iniciar Sesión' : '✨ Crear Cuenta'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {activeTab === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button
                className="auth-link"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                }}
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                className="auth-link"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
