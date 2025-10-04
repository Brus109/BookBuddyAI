// src/main.tsx - VERIFICAR
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // ✅ Asegurar que existe
import './App.css'   // ✅ Agregar esta línea si no está

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)