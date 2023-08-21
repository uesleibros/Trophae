module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "sm": { "max" :"640px" }, // Alterei o valor máximo para 640px
        "md": "768px", // Exemplo: 768px para médio (tablets)
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
