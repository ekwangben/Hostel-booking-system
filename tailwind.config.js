/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        accent: "#F59E0B",
        background: "#F3F4F6",
        dark: "#1F2937"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'title': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subtitle': ['1.5rem', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  safelist: [
    'btn-view-details',
    'px-4',
    'py-2',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'duration-200',
    {
      pattern: /bg-(primary|secondary|indigo|emerald)-(400|500|600|700)/,
      variants: ['hover']
    },
    {
      pattern: /text-(white|gray)-(400|500|600|700)/
    }
  ]
}







