// src/App.tsx - Con AuthProvider integrado
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './components/HomePage';
import { FavoritesPage } from './components/FavoritesPage';
import { BookDetailPage } from './components/BookDetailPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
