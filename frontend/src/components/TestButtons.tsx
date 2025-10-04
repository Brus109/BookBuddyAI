// src/components/TestButtons.tsx
import { useNavigate } from 'react-router-dom';

export function TestButtons() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Botones de Prueba</h3>
      
      <button 
        onClick={() => {
          console.log('Test Favoritos');
          navigate('/favorites');
        }}
        style={{ padding: '10px', margin: '5px' }}
      >
        Test Favoritos
      </button>
      
      <button 
        onClick={() => {
          console.log('Test Libro 1');
          navigate('/book/1');
        }}
        style={{ padding: '10px', margin: '5px' }}
      >
        Test Libro 1
      </button>
    </div>
  );
}