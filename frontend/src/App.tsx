// src/App.tsx - VERIFICAR
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { FavoritesPage } from './components/FavoritesPage';
import { BookDetailPage } from './components/BookDetailPage';
import './App.css'; // ✅ Esta línea debe estar

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;