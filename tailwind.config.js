/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          bg: '#ffffff',
          soft: '#f6f4fa',
          line: '#ece9f2',
          text: '#15121d',
          muted: '#6d6979',
          pink: '#ff3d81',
          'pink-strong': '#d81e63',
          'pink-soft': '#ffe4ef',
          yellow: '#ffe45c',
          lilac: '#e7e0ff',
          mint: '#cbf4e0',
          sky: '#d7ecff',
          peach: '#ffe1cf',
          danger: '#d92d3a',
          ok: '#0e8f48',
        },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'coy-pop': '3px 3px 0 #15121d',
        'coy-pop-sm': '2px 2px 0 #15121d',
        'coy-pop-lg': '5px 5px 0 #15121d',
        'coy-pop-xl': '7px 7px 0 #15121d',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
