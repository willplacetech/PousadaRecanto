export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F8F6F0', linen: '#E8E1D5', card: '#FFFDF9',
        pine: '#18221B', ink: '#1C2520', moss: '#526056',
        fog: '#8A978E', sage: '#5C745D', clay: '#C86D51',
        claydark: '#A95540', hairline: '#E5DFD3',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(28, 37, 32, 0.05)',
        lift: '0 18px 50px rgba(28, 37, 32, 0.12)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 70s linear infinite' },
    },
  },
  plugins: [],
};
