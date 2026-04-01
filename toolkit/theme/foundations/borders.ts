import type { ThemingConfig } from '@chakra-ui/react';

import type { ExcludeUndefined } from 'types/utils';

export const radii: ExcludeUndefined<ThemingConfig['tokens']>['radii'] = {
  none: { value: '0' },
  sm: { value: '0px' },
  base: { value: '0px' },
  md: { value: '0px' },
  lg: { value: '0px' },
  xl: { value: '0px' },
  full: { value: '9999px' },
};
