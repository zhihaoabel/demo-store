/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ["Inter var", "sans-serif"],
        'roboto': ['Roboto', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'source-sans-pro': ['Source Sans Pro', 'sans-serif'],
        'merriweather': ['Merriweather', 'sans-serif'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'pt-sans': ['PT Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

