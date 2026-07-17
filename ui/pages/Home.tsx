import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { CosmicBackground } from 'ui/home/CosmicBackground';
import { HomeRpcDataContextProvider } from 'ui/home/fallbacks/rpcDataContext';
import HeroBanner from 'ui/home/HeroBanner';
import Highlights from 'ui/home/Highlights';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestArbitrumL2Batches from 'ui/home/latestBatches/LatestArbitrumL2Batches';
import LatestZkEvmL2Batches from 'ui/home/latestBatches/LatestZkEvmL2Batches';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';

const rollupFeature = config.features.rollup;

const Home = () => {
  const isMobile = useIsMobile();

  const leftWidget = (() => {
    if (rollupFeature.isEnabled && !rollupFeature.homepage.showLatestBlocks) {
      switch (rollupFeature.type) {
        case 'zkEvm':
          return <LatestZkEvmL2Batches/>;
        case 'arbitrum':
          return <LatestArbitrumL2Batches/>;
      }
    }

    return <LatestBlocks/>;
  })();

  return (
    <HomeRpcDataContextProvider>
      <Box as="main" position="relative" zIndex={ 10 } w="100%" pb={ 20 }>
        <CosmicBackground/>

        <Box pt={ 8 } pb={ 12 } maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
          <HeroBanner/>
        </Box>

        <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 1 } mt={ 3 } _empty={{ mt: 0 }} mb={ 8 }>
            <Stats/>
            <ChainIndicators/>
          </Flex>

          { !isMobile && config.UI.homepage.highlights && <Highlights mt={ 3 }/> }
          { isMobile && <AdBanner mt={ 6 } mx="auto" justifyContent="center" format="mobile"/> }

          <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 8 } rowGap={ 6 }>
            <Box flex={{ lg: 3 }} maxW={{ lg: '30%' }} w="100%">
              { leftWidget }
            </Box>
            <Box flex={{ lg: 7 }} maxW={{ lg: '70%' }} w="100%">
              <Transactions/>
            </Box>
          </Flex>
        </Box>

        { /* Footer Terminal Bar */ }
        <Box
          position="fixed"
          bottom={ 0 } left={ 0 } right={ 0 }
          bg="rgba(5, 7, 10, 0.95)"
          borderTop="1px solid rgba(255, 255, 255, 0.05)"
          display={{ base: 'none', md: 'flex' }}
          justifyContent="space-between"
          px={ 6 } py={ 2 }
          fontSize="10px"
          color="rgba(34, 197, 94, 0.8)" /* green */
          fontFamily="'Space Mono', monospace"
          zIndex={ 100 }
        >
          <Flex gap={ 4 } alignItems="center">
            <Box display="flex" alignItems="center">
              <Box w="6px" h="6px" bg="rgba(34, 197, 94, 1)" mr={ 2 }/>
              SYS_ONLINE
            </Box>
            <Box color="gray.600">/</Box>
            <Box color="cyan.500">STARFIELD: CALM</Box>
            <Box color="gray.600">/</Box>
            <Box color="red.500">NIGHT_GRID: SOFT</Box>
          </Flex>
          <Flex gap={ 4 } alignItems="center">
            <Box color="red.500">SIGNAL_BLOOM: IDLE</Box>
            <Box color="gray.600">/</Box>
            <Box color="cyan.500">MERIDIAN_GLOW: LOW</Box>
          </Flex>
        </Box>

      </Box>
    </HomeRpcDataContextProvider>
  );
};

export default Home;
