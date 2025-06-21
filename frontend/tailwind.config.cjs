module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Forzar generación de clases de texto
      colors: {
        blue: {
          600: '#2563eb', // Color explícito para text-blue-600
        },
        gray: {
          700: '#374151', // Color explícito para text-gray-700
        }
      }
    },
  },
  plugins: [],
  // Añade esto para asegurar la generación de clases base
  corePlugins: {
    preflight: true, // Asegura que los estilos base se incluyan
  }
}
