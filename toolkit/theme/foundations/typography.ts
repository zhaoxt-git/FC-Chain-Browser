import type { ThemingConfig } from '@chakra-ui/react';

import type { ExcludeUndefined } from 'types/utils';

import config from 'configs/app';

export const BODY_TYPEFACE = '"Space Mono", "Montserrat", "Inter", ui-sans-serif, system-ui, sans-serif';
export const HEADING_TYPEFACE = '"Orbitron", "Space Mono", "Roboto Mono", ui-monospace, monospace';

export const fonts: ExcludeUndefined<ThemingConfig['tokens']>['fonts'] = {
  heading: { value: HEADING_TYPEFACE },
  body: { value: BODY_TYPEFACE },
};

export const textStyles: ThemingConfig['textStyles'] = {
  heading: {
    xl: {
      value: {
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: '500',
        letterSpacing: '-0.5px',
        fontFamily: 'heading',
      },
    },
    lg: {
      value: {
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: '500',
        fontFamily: 'heading',
      },
    },
    md: {
      value: {
        fontSize: '18px',
        lineHeight: '24px',
        fontWeight: '500',
        fontFamily: 'heading',
      },
    },
    sm: {
      value: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '500',
        fontFamily: 'heading',
      },
    },
    xs: {
      value: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '600',
        fontFamily: 'heading',
      },
    },
  },
  text: {
    xl: {
      value: {
        fontSize: '20px',
        lineHeight: '28px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
    md: {
      value: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
    sm: {
      value: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
    xs: {
      value: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
  },
};
