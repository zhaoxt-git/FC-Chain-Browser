import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import { useIsSticky } from 'toolkit/hooks/useIsSticky';

type Props = {
  children: React.ReactNode;
  className?: string;
  showShadow?: boolean;
};

export const ACTION_BAR_HEIGHT_DESKTOP = 24 + 32 + 12;
export const ACTION_BAR_HEIGHT_MOBILE = 24 + 32 + 24;

const ActionBar = ({ children, className, showShadow }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isSticky = useIsSticky(ref, 5);

  if (!React.Children.toArray(children).filter(Boolean).length) {
    return null;
  }

  return (
    <Flex
      className={ className }
      backgroundColor={ isSticky ? { _light: 'rgba(255, 255, 255, 0.95)', _dark: 'rgba(10, 10, 10, 0.95)' } : 'bg.primary' }
      backdropFilter={ isSticky ? 'blur(10px)' : 'none' }
      pt={ 6 }
      mt={ -6 }
      pb={{ base: 6, lg: 3 }}
      mx={{ base: -3, lg: 0 }}
      px={{ base: 3, lg: 0 }}
      justifyContent="space-between"
      width={{ base: '100vw', lg: 'unset' }}
      position="sticky"
      top={ 0 }
      transitionProperty="top,box-shadow,background-color,color,backdrop-filter,border-bottom"
      transitionDuration="normal"
      zIndex={{ base: 'sticky2', lg: 'docked' }}
      boxShadow={{
        base: isSticky ? { _light: 'action_bar', _dark: '0 4px 20px rgba(0, 0, 0, 0.6)' } : 'none',
        lg: isSticky && showShadow ? { _light: 'action_bar', _dark: '0 4px 20px rgba(0, 0, 0, 0.6)' } : 'none',
      }}
      borderBottom={ isSticky && showShadow ? { _light: '1px solid rgba(0,0,0,0.1)', _dark: '1px solid rgba(255,255,255,0.08)' } : '1px solid transparent' }
      ref={ ref }
    >
      { children }
    </Flex>
  );
};

export default chakra(ActionBar);
