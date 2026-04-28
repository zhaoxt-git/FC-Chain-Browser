import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { SocketProvider } from 'lib/socket/context';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import AdaptiveTabs from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';
import LatestOptimisticDeposits from 'ui/home/latestDeposits/LatestOptimisticDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import LatestZetaChainCCTXs from 'ui/home/latestZetaChainCCTX/LatestZetaChainCCTXs';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';
import useAuth from 'ui/snippets/auth/useIsAuth';

import { useHomeRpcDataContext } from './fallbacks/rpcDataContext';
import LatestCrossChainTxs from './latestCrossChainTxs/LatestCrossChainTxs';
import LatestArbitrumDeposits from './latestDeposits/LatestArbitrumDeposits';

const rollupFeature = config.features.rollup;
const zetachainFeature = config.features.zetachain;
const crossChainTxsFeature = config.features.crossChainTxs;

const Transactions = () => {

  const isAuth = useAuth();
  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled && !rpcDataContext.isLoading && !rpcDataContext.isError && rpcDataContext.subscriptions.includes('latest-txs');

  let innerContent = null;

  if ((rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum')) || isAuth || zetachainFeature.isEnabled) {
    const tabs = [
      zetachainFeature.isEnabled && {
        id: 'cctx',
        title: 'Cross-chain',
        component: (
          <SocketProvider url={ config.apis.zetachain?.socketEndpoint } name="zetachain">
            <LatestZetaChainCCTXs/>
          </SocketProvider>
        ),
      },
      { id: 'txn', title: zetachainFeature.isEnabled ? 'ZetaChain EVM' : 'Latest txn', component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' &&
        { id: 'deposits', title: `Deposits (${ layerLabels.parent }→${ layerLabels.current } txn)`, component: <LatestOptimisticDeposits/> },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        { id: 'deposits', title: `Deposits (${ layerLabels.parent }→${ layerLabels.current } txn)`, component: <LatestArbitrumDeposits/> },
      isAuth && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    innerContent = <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>;
  } else if (crossChainTxsFeature.isEnabled) {
    const tabs = [
      { id: 'txs', title: 'Txns', component: <LatestTxs/> },
      { id: 'cross_chain_txs', title: 'Cross-chain txns', component: <LatestCrossChainTxs/> },
    ];
    innerContent = <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>;
  } else {
    innerContent = <LatestTxs/>;
  }

  return (
    <Box 
      w="100%"
      flexShrink={ 0 }
      bg="rgba(10, 10, 12, 0.8)" /* bg-black/80 */
      border="1px solid rgba(255, 255, 255, 0.05)" /* border-white/5 */
      overflow="hidden"
      display="flex"
      flexDir="column"
    >
      <Box 
        px={5} 
        py={4}
        borderBottom="1px solid rgba(255, 255, 255, 0.05)" /* matching layout */
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        bg="transparent"
      >
        <Heading 
          as="h2" 
          fontSize="15px" 
          m={0}
          fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
          className="text-telemetry" 
          color="white" 
          display="flex" 
          alignItems="center" 
          textTransform="uppercase" 
          letterSpacing="0.02em" 
          fontWeight="900"
        >
          <Box w="5px" h="5px" bg="rgba(229, 193, 88, 1)" mr={3} shadow="none" />
          TRANSACTIONS
          { isRpcData && <Box ml={2}><FallbackRpcIcon/></Box> }
        </Heading>
        
        <Link 
          href={ route({ pathname: '/txs' }) } 
          fontSize="9px" 
          className="text-telemetry" 
          fontWeight={700}
          color="#e5c158" 
          _hover={{ color: 'white', borderColor: 'rgba(229, 193, 88, 0.3)' }}
          transition="colors 0.2s"
          px={3} py={1.5}
          bg="transparent"
          border="1px solid rgba(255, 255, 255, 0.1)"
          textTransform="uppercase"
          letterSpacing="0.1em"
          textDecoration="none !important"
        >
          VIEW ALL
        </Link>
      </Box>

      <Box position="relative" flex={1} overflow="hidden">
        {/* Shadow overlay matching Explorer.tsx bottom gradient */}
        <Box position="absolute" bottom={0} left={0} right={0} h={16} bg="linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.8), transparent)" zIndex={10} pointerEvents="none" />
        <Box maxH="600px" overflowY="auto" className="scrollbar-hide" py={2} px={2} display="flex" flexDir="column" gap={2} position="relative">
          { innerContent }
        </Box>
      </Box>
    </Box>
  );
};

export default Transactions;
