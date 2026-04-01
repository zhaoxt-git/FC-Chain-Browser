import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

export const ChartWatermark = React.memo((props: any) => {
  return (
    <Flex
      position="absolute"
      opacity={ 0.1 }
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      pointerEvents="none"
      alignItems="center"
      justifyContent="center"
      filter="grayscale(100%) contrast(150%)"
      { ...props }
    >
      <img src="/logo.jpg" alt="FC Chain Watermark" style={{ height: '56px', width: '56px', objectFit: 'contain', opacity: 0.8 }} />
      <Box ml={4} fontWeight="800" fontSize="32px" letterSpacing="0.15em" color={{ _light: 'black', _dark: 'white' }} whiteSpace="nowrap" fontFamily="'Inter', sans-serif">
        FC CHAIN
      </Box>
    </Flex>
  );
});
