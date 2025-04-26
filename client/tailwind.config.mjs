/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'small' : {'min': '0px', 'max': '500px'},
      'medium' : {'min': '0px', 'max': '767px'},
      'large' : {'min': '768px', 'max': '1600px'},
      'sm': '640px',

      'md': '768px',

      'lg': '1024px',

      'xl': '1280px',

    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
