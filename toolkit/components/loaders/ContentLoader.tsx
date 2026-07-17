import type { BoxProps } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';

interface Props extends BoxProps {
  text?: string;
}

const DEFAULT_WIDTH = '320px';

export const ContentLoader = React.memo(({ text, ...props }: Props) => {
  return (
    <Box display="inline-block" w={ DEFAULT_WIDTH } maxW="100%" alignSelf="flex-start" { ...props }>
      <Box
        width="100%"
        height="6px"
        position="relative"
        containerType="inline-size"
        overflow="hidden"
        _after={{
          content: `" "`,
          position: 'absolute',
          width: '60px',
          height: '6px',
          animation: `fromLeftToRight 700ms ease-in-out infinite alternate`,
          left: 0,
          top: 0,
          backgroundColor: 'blue.300',
          borderRadius: 'full',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />
      <Text mt={ 6 } color="text.secondary" whiteSpace="nowrap">
        { text || 'Loading data, please wait...' }
      </Text>
    </Box>
  );
});
