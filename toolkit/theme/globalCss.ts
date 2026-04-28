import type { SystemConfig } from '@chakra-ui/react';

import addressEntity from './globals/address-entity';
import entity from './globals/entity';
import recaptcha from './globals/recaptcha';
import scrollbar from './globals/scrollbar';

const webkitAutofillOverrides = {
  WebkitTextFillColor: 'var(--chakra-colors-input-fg)',
  '-webkit-box-shadow': '0 0 0px 1000px var(--chakra-colors-input-bg) inset',
  transition: 'background-color 5000s ease-in-out 0s',
};

const webkitAutofillRules = {
  '&:-webkit-autofill': webkitAutofillOverrides,
  '&:-webkit-autofill:hover': webkitAutofillOverrides,
  '&:-webkit-autofill:focus': webkitAutofillOverrides,
};

// Using pure Apple/Tangem minimalism approach
const globalCss: SystemConfig['globalCss'] = {
  body: {
    bg: '#0A0C10 !important', // Slightly lighter dark tech background
    backgroundColor: '#0A0C10 !important',
    color: '#FFFFFF !important',
    fontFamily: '"Space Mono", "Montserrat", "Inter", ui-sans-serif, system-ui, sans-serif !important',
    WebkitTapHighlightColor: 'transparent',
    fontVariantLigatures: 'no-contextual',
    focusRingStyle: 'hidden',
  },
  mark: {
    bg: 'global.mark.bg',
    color: 'inherit',
  },
  '::selection': {
    bg: 'global.selection.bg',
  },
  'svg *::selection': {
    color: 'none',
    background: 'none',
  },
  form: {
    w: '100%',
  },
  input: {
    // hide number input arrows in Google Chrome
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    ...webkitAutofillRules,
    border: '1px solid rgba(255, 255, 255, 0.05) !important', // Exact match to cards
    borderRadius: '0px !important', // Strict Authority OS corners
    transition: 'all 0.2s ease',
    background: 'rgba(10, 10, 12, 0.8) !important', // Exact match to cards
    '&:focus': {
      boxShadow: 'none !important',
      borderColor: 'rgba(229, 193, 88, 0.5) !important',
    },
  },
  textarea: {
    ...webkitAutofillRules,
  },
  select: {
    ...webkitAutofillRules,
  },
  ...recaptcha,
  ...scrollbar,
  ...entity,
  ...addressEntity,
  // FCB / Tangem Stark Minimalism Aesthetic
  'button, a, .chakra-button': {
    transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1) !important',
    borderRadius: '0px !important',
  },
  'button:hover, .chakra-button:hover': {
    transform: 'scale(1.02) !important',
    boxShadow: 'none !important', // Stripping all ugly glowing shadows
  },
  // Sleek, layered architecture with distinct panel elevations
  'div[class*="Card"], div[class*="Panel"], div[class*="Container"], aside, main > div > div > div': {
    borderRadius: '0px !important', // Strict Authority OS corners
    backdropFilter: 'none !important',
    boxShadow: 'none !important', // Eliminating all messy drop shadows
    transition: 'border-color 0.3s ease, transform 0.3s ease',
  },
  'div[class*="Card"]:hover, div[class*="Panel"]:hover': {
    borderColor: 'rgba(255, 255, 255, 0.08) !important', // Barely-there glow edge
    boxShadow: 'none !important',
  },
};

export default globalCss;
