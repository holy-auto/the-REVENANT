import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'], theme: { extend: { colors: { ink:'#111111', charcoal:'#191919', graphite:'#2b2a28', ivory:'#f6f0e6', bronze:'#a66a3f', wine:'#7a1f1f' }, fontFamily: { sans: ['var(--font-noto-sans-jp)','system-ui','sans-serif'], serif: ['var(--font-noto-serif-jp)','serif'] } } }, plugins: [] };
export default config;
