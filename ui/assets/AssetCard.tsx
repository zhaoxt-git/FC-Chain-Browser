import { Box, Flex, Text, Image, Badge } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

export const AssetCard = ({ id, name, type, imageUrl, volume, items, floor, status }: any) => {
  const isVerified = status === 'SYS_VERIFIED';
  
  return (
    <NextLink href={`/assets/${id}` as any} passHref style={{ textDecoration: 'none' }}>
      <Box
        as="a"
        display="block"
        w="100%"
        bg="black"
        border="1px solid"
        borderColor="whiteAlpha.300"
        position="relative"
        transition="all 0.3s ease"
        cursor="pointer"
        _hover={{
          borderColor: 'red.500', 
          boxShadow: '0 0 15px rgba(229, 62, 62, 0.4)',
          transform: 'translateY(-2px)'
        }}
        _before={{
          content: '""',
          position: 'absolute', top: '-1px', left: '-1px', width: '6px', height: '6px',
          borderTop: '2px solid red', borderLeft: '2px solid red', zIndex: 2
        }}
      >
        {/* Verification Badge */}
        <Flex position="absolute" top="10px" left="10px" zIndex="10">
          <Badge bg={isVerified ? 'green.500' : 'orange.500'} color="black" borderRadius="0" px={2} py={0.5} fontSize="xs" fontWeight="bold">
            [{status}]
          </Badge>
        </Flex>

        {/* Media Block with Cyberpunk Scanlines */}
        <Box h="200px" overflow="hidden" position="relative" borderBottom="1px solid" borderColor="whiteAlpha.300">
          <Image 
            src={imageUrl} 
            alt={name}
            w="100%" h="100%" objectFit="cover" filter="grayscale(50%) contrast(120%)"
            transition="filter 0.3s ease"
            _groupHover={{ filter: 'grayscale(0%) contrast(100%)' }}
          />
          <Box 
            position="absolute" top={0} left={0} w="100%" h="100%" 
            background="linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))" 
            backgroundSize="100% 4px, 3px 100%"
            pointerEvents="none"
            opacity={0.5}
            transition="opacity 0.3s ease"
            _groupHover={{ opacity: 0.1 }}
          />
        </Box>

        {/* Metadata Board */}
        <Box p={4}>
          <Text color="red.400" fontSize="10px" letterSpacing="0.1em" textTransform="uppercase" mb={1} fontFamily="monospace">
            {type} // POOL_ID_0{id}
          </Text>
          <Text color="white" fontSize="md" fontWeight="bold" lineClamp={1} mb={3} fontFamily="'Inter', sans-serif">
            {name}
          </Text>
          
          <Flex justify="space-between" align="center" borderTop="1px dashed" borderColor="whiteAlpha.200" pt={3}>
            <Text color="gray.500" fontSize="xs" fontFamily="monospace">FLOOR_VALUATION</Text>
            <Text color="green.400" fontSize="xs" fontWeight="bold" fontFamily="monospace">
              {floor}
            </Text>
          </Flex>
          <Flex justify="space-between" align="center" pt={1}>
            <Text color="gray.500" fontSize="xs" fontFamily="monospace">24H_VOLUME</Text>
            <Text color="whiteAlpha.800" fontSize="xs" fontFamily="monospace">
              {volume}
            </Text>
          </Flex>
          <Flex justify="space-between" align="center" pt={1}>
            <Text color="gray.500" fontSize="xs" fontFamily="monospace">TOTAL_ITEMS</Text>
            <Text color="whiteAlpha.800" fontSize="xs" fontFamily="monospace">
              {items}
            </Text>
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
};
