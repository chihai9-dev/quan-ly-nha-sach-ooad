import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Đồng bộ bảng màu mộc. (UI/assets/moc.css) trên toàn bộ ứng dụng
        indigo: {
          50: '#eff4ee',
          100: '#e3ede4',
          200: '#c7dbc9',
          300: '#9dc1a3',
          400: '#6ea179',
          500: '#3f7a58',
          600: '#24533a',
          700: '#1d4630',
          800: '#173826',
          900: '#122c1e',
          950: '#0b1c13',
        },
        slate: {
          50: '#f6f6f1',
          100: '#f2f2eb',
          200: '#e7e6dc',
          300: '#d9d8cc',
          400: '#a3a89f',
          500: '#737a72',
          600: '#555d55',
          700: '#3b453f',
          800: '#1e2a23',
          900: '#141d18',
          950: '#0d1410',
        },
        moc: {
          green900: '#1d4630',
          green800: '#24533a',
          green700: '#2f6648',
          green600: '#3f7a58',
          green100: '#e3ede4',
          green50: '#eff4ee',
          bg: '#f6f6f1',
          side: '#f2f2eb',
          line: '#e7e6dc',
          line2: '#efeee6',
          ink: '#1e2a23',
          ink2: '#3b453f',
          muted: '#737a72',
          faint: '#a3a89f',
          amber: '#b7791f',
          amberBg: '#fcf0d9',
          red: '#b4472f',
          redBg: '#fae6e0',
          blue: '#3b6a8f',
          blueBg: '#e5eef5',
        },
      },
    },
  },
  plugins: [],
};
export default config;
