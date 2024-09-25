/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans your files for class names
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, #fa709a 0%, #fee140 100%)",
        "custom-gradient1": "linear-gradient(to top, #0250c5 0%, #d43f8d 100%)",
      },
    },
  },
  plugins: [],
};
