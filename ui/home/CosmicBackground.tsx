import React from 'react';
import { Box } from '@chakra-ui/react';

export const CosmicBackground = () => {
  return (
    <Box position="fixed" top={0} right={0} bottom={0} left={0} zIndex={-3} pointerEvents="none" overflow="hidden">
      {/* Ambient Cosmic Radial Gradients */}
      <Box 
        position="absolute" 
        top={0} right={0} bottom={0} left={0}
        bg="radial-gradient(circle at 50% 30%, rgba(202,138,4,0.08) 0%, transparent 40%), radial-gradient(circle at 10% 80%, rgba(56,189,248,0.05) 0%, transparent 30%), radial-gradient(circle at 90% 20%, rgba(234,179,8,0.04) 0%, transparent 40%)" 
      />
      
      {/* Star Dust Drift Layers */}
      <Box className="stars-1" opacity={0.6} />
      <Box className="stars-2" opacity={0.5} />
    </Box>
  );
};
