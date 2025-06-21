// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#2563eb',
        },
        gray: {
          700: '#374151',
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  }
}
