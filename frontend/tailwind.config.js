/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef

export const content = ['./src/**/*.{html,js,ts,tsx}']
export const theme = {
  extend: {
    transitionProperty: {
      maxHeight: 'maxHeight',
    },
    keyframes: {
      sideBarOpen: {
        '0%': { transform: 'rotate(0.0deg)' },
        '10%': { transform: 'rotate(14deg)' },
        '20%': { transform: 'rotate(-8deg)' },
        '30%': { transform: 'rotate(14deg)' },
        '40%': { transform: 'rotate(-4deg)' },
        '50%': { transform: 'rotate(10.0deg)' },
        '60%': { transform: 'rotate(0.0deg)' },
        '100%': { transform: 'rotate(0.0deg)' },
      },
      sideBarClose: {
        '100%': { width: '100%' },
        '0%': { width: '0%' },
      },
    },
    height: {
      128: '32rem',
    },
    screens: {
      '3xl': '1750',
      xs: '490px',
    },
    colors: {
      brightModeColor: '#e2e8f0',
      darkModeColor: '#27272a',
    },
  },
}

export const darkMode = 'class'
export const purge = {
  enabled: true,
  content: ['./public/**/*.html', './src/**/*.{ts,tsx}'],
}
