/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: "-10px",
        xxxs: "8px",
        xxxxs: "6px",
        xxxxxs: "4px",
        xxxxxxs: "2px",
      },
    },
  },
  plugins: [],
};
