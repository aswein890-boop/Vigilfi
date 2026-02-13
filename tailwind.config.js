module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F59E0B',
          50: '#FFFAF0',
          100: '#FFF6E0'
        },
        accent: '#F59E0B',
        brandBg: '#FFF9EB',
        glass: 'rgba(255,255,255,0.6)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft-md': '0 6px 18px rgba(16,24,40,0.06)'
      }
    }
  },
  plugins: []
};
