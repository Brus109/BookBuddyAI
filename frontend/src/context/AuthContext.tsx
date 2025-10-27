import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User, SaveBook } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string, preferences?: Record<string, any>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('bookbuddy-token');
    const savedUser = localStorage.getItem('bookbuddy-user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading auth data:', error);
        localStorage.removeItem('bookbuddy-token');
        localStorage.removeItem('bookbuddy-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Función para sincronizar favoritos de localStorage al backend
  const syncLocalFavoritesToBackend = async (token: string) => {
    try {
      const localFavorites = localStorage.getItem('bookbuddy-favorites');
      if (!localFavorites) return;

      const favorites: SaveBook[] = JSON.parse(localFavorites);
      if (favorites.length === 0) return;

      console.log(`🔄 Sincronizando ${favorites.length} favoritos con el backend...`);

      // Enviar cada favorito al backend
      const syncPromises = favorites.map(fav => 
        apiService.saveBook(fav, token).catch(err => {
          console.error('Error syncing favorite:', fav.book_id, err);
          return null; // No fallar todo el proceso por un error individual
        })
      );

      await Promise.all(syncPromises);
      
      // Limpiar localStorage después de sincronizar
      localStorage.removeItem('bookbuddy-favorites');
      console.log('✅ Favoritos sincronizados exitosamente');
    } catch (error) {
      console.error('Error al sincronizar favoritos:', error);
      // No lanzar error, permitir que el login continúe
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const newToken = response.token;
      
      // Crear objeto user básico
      const newUser: User = {
        id: email, // Temporal, idealmente el backend debería devolver el user completo
        email,
        name: email.split('@')[0]
      };
      
      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('bookbuddy-token', newToken);
      localStorage.setItem('bookbuddy-user', JSON.stringify(newUser));

      // Sincronizar favoritos locales con backend
      await syncLocalFavoritesToBackend(newToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, full_name: string, preferences: Record<string, any> = {}) => {
    try {
      const response = await apiService.register(email, password, full_name, preferences);
      
      // Después del registro, hacer login automático
      await login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bookbuddy-token');
    localStorage.removeItem('bookbuddy-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
