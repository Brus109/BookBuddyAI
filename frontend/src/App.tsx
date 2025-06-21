import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Estilo en línea como respaldo */}
      <h1 
        className="text-4xl font-bold text-blue-600 mb-4"
        style={{ color: '#2563eb' }} // Color hexadecimal explícito
      >
        ¡BookBuddyAI está funcionando!
      </h1>
      
      <p 
        className="text-lg text-gray-700 mb-6"
        style={{ color: '#374151' }} // Color hexadecimal explícito
      >
        Tailwind CSS está aplicando estilos correctamente
      </p>
      
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Botón de Prueba
      </button>
    </div>
  );
}

export default App;
