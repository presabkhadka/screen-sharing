/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient1": "linear-gradient(to top, #0250c5 0%, #d43f8d 100%)",
        "custom-gradient": "linear-gradient(to right, #f83600 0%, #f9d423 100%)",
      },
    },
  },
  plugins: [],
};
