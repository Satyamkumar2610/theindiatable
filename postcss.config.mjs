/**
 * Tailwind v4 through PostCSS: the integration Next.js documents. It replaced
 * the @tailwindcss/turbopack loader, whose cached compile shipped a stale
 * globals.css to production (new HTML, old stylesheet).
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
