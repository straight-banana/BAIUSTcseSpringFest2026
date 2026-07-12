import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hind', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          fg: 'rgb(var(--brand-fg) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        // Named palette aliases
        paper: 'rgb(var(--bg) / <alpha-value>)',
        ink: 'rgb(var(--rule) / <alpha-value>)',
        ochre: 'rgb(var(--brand) / <alpha-value>)',
        stamp: 'rgb(var(--danger) / <alpha-value>)',
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '10px',
      },
      boxShadow: {
        xs: 'none',
        sm: 'none',
        md: '0 1px 0 0 rgb(var(--rule) / 0.08)',
        lg: '0 2px 0 0 rgb(var(--rule) / 0.10)',
      },
      transitionDuration: { 250: '250ms' },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(2rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 200ms ease-out',
        'fade-in-up': 'fade-in-up 400ms ease-out both',
      },
    },
  },
  plugins: [],
};
