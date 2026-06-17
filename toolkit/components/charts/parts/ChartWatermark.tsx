import { Box, Flex, type FlexProps } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

export const ChartWatermark = React.memo((props: FlexProps) => {
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
      <Image src="/logo.jpg" alt="Meridian Watermark" width={ 56 } height={ 56 } style={{ objectFit: 'contain', opacity: 0.8 }}/>
      <Box
        ml={ 4 }
        fontWeight="800"
        fontSize="32px"
        letterSpacing="0.15em"
        color={{ _light: 'black', _dark: 'white' }}
        whiteSpace="nowrap"
        fontFamily="'Inter', sans-serif"
      >
        Meridian
      </Box>
    </Flex>
  );
});
