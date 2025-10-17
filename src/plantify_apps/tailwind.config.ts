import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        ibm: ['IBM Plex Serif', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
