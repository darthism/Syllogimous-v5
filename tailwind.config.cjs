/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  // Keep legacy CSS behavior stable; you can enable preflight once styles are migrated to Tailwind.
  corePlugins: {
    preflight: false
  }
};


