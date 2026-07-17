import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { Heading } from 'toolkit/chakra/heading';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';
import SearchBarMobile from 'ui/snippets/searchBar/SearchBarMobile';

const HeroBanner = () => {
  return (
    <Box position="relative" w="100%" className="pt-8 pb-12 group">
      { /* Ambient background glow matching Explorer.tsx */ }
      <Box
        position="absolute"
        top="0" bottom="0" left="0" right="0"
        bg="rgba(229, 193, 88, 0.05)" /* red-500/5 */
        filter="blur(40px)"
        transform="scale(1.1)"
        opacity={ 0.5 }
        transition="opacity 0.7s"
        pointerEvents="none"
        _groupHover={{ opacity: 1 }}
      />

      <Box maxW="3xl" mx="auto" textAlign="center" position="relative" zIndex={ 10 }>
        <Flex justifyContent="space-between" alignItems="center" w="100%" mb={ 8 }>
          <Heading
            as="h1"
            fontSize={{ base: '32px', md: '56px' }}
            color="white"
            textTransform="uppercase"
            letterSpacing="0.05em"
            fontWeight={ 700 }
            fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
            className="text-vanguard"
            m={ 0 }
            mx="auto"
            textAlign="center"
          >
            NETWORK <Box as="span" color="rgba(229, 193, 88, 1)" letterSpacing="0.05em">TELEMETRY</Box>
          </Heading>
        </Flex>

        <Box
          position="relative"
          zIndex={ 10 }
          display="flex"
          w="100%"
          maxW="900px"
          mx="auto"
          alignItems="center"
          className="hero-search-wrapper"
        >
          <style>{ `
            .hero-search-wrapper .search-input-container {
               background: transparent !important;
               border: none !important;
               box-shadow: none !important;
            }
            .hero-search-wrapper input {
               color: white !important;
               font-family: 'Space Mono', monospace;
               text-transform: uppercase;
               letter-spacing: 0.1em;
               height: 64px !important;
            }
            .hero-search-wrapper input::placeholder {
               color: rgba(255,255,255,0.3);
               text-transform: uppercase;
            }
            .hero-search-wrapper .search-scan-text {
               color: rgba(229, 193, 88, 1);
               font-family: 'Space Mono', monospace;
               font-weight: bold;
               letter-spacing: 0.1em;
               padding-right: 24px;
            }
          ` }</style>
          <Box display={{ base: 'flex', lg: 'none' }} w="100%">
            <SearchBarMobile isHeroBanner/>
          </Box>
          <Box display={{ base: 'none', lg: 'flex' }} w="100%">
            <Box w="100%" background="transparent">
              <SearchBar isHeroBanner/>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(HeroBanner);
