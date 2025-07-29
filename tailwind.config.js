/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./public/**/*.html",
      "./src/**/*.{js,ts,jsx,tsx}", // atau sesuaikan dengan lokasi file kamu
      "./node_modules/flowbite/**/*.js"
    ],
    theme: {
      extend: {},
    },
    plugins: [
        require('flowbite/plugin')
      ],
      
  }