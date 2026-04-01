import { useBreakpointValue, chakra } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

export const LIGHTNING_LABEL_CLASS_NAME = 'lightning-label';

interface Props {
  className?: string;
  iconColor?: string;
  isCollapsed?: boolean;
}

const LightningLabel = ({ className, iconColor, isCollapsed }: Props) => {
  const isLgScreen = useBreakpointValue({ base: false, lg: true, xl: false });

  const isExpanded = !isCollapsed;

  const color = React.useMemo(() => {
    if (isCollapsed) {
      return (iconColor && iconColor !== 'transparent') ? iconColor : 'bg.primary';
    }
    return 'transparent';
  }, [ iconColor, isCollapsed ]);

  return (
    <IconSvg
      className={ LIGHTNING_LABEL_CLASS_NAME + (className ? ` ${ className }` : '') }
      name="lightning_navbar"
      boxSize={ 4 }
      ml={ isCollapsed ? 0 : 1 }
      position={ isCollapsed ? 'absolute' : 'relative' }
      top={ isCollapsed ? '10px' : '0' }
      right={ isCollapsed ? '15px' : '0' }
      color={ color }
      transitionProperty="color, margin-left"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    />
  );
};

export default chakra(LightningLabel);
