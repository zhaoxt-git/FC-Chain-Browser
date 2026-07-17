import { chakra, Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { SECOND } from 'toolkit/utils/consts';
import { nbsp } from 'toolkit/utils/htmlEntities';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';

import LatestBlocksDegraded from './fallbacks/LatestBlocksDegraded';
import { useHomeRpcDataContext } from './fallbacks/rpcDataContext';
import LatestBlocksItem from './LatestBlocksItem';

const LATEST_BLOCKS_REFETCH_INTERVAL = 15 * SECOND;

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_blocks', {
    queryOptions: {
      placeholderData: Array(blocksMaxCount).fill(BLOCK),
      refetchInterval: LATEST_BLOCKS_REFETCH_INTERVAL,
    },
  });
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (block) => block.height,
    enabled: !isPlaceholderData,
  });

  const queryClient = useQueryClient();
  const statsQueryResult = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled &&
    !rpcDataContext.isLoading &&
    !rpcDataContext.isError &&
    rpcDataContext.subscriptions.includes('latest-blocks');

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('general:homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  const content = (() => {
    if (isError) {
      return <LatestBlocksDegraded maxNum={ blocksMaxCount }/>;
    }
    if (data && data.length > 0) {
      const dataToShow = data.slice(0, blocksMaxCount);

      return (
        <>
          <VStack gap={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
            { dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={ block.height + (isPlaceholderData ? String(index) : '') }
                block={ block }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(block) }
              />
            ))) }
          </VStack>
          <Flex justifyContent="center">
            <Link textStyle="sm" href={ route({ pathname: '/blocks' }) } loading={ isPlaceholderData }
              fontFamily="'Space Mono', monospace, 'Inter', sans-serif"
              fontSize="12px"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="#63B3ED"
              _hover={{ color: '#90CDF4', textDecoration: 'none' }}
            >View all blocks</Link>
          </Flex>
        </>
      );
    }
    return <Box textStyle="sm">No latest blocks found.</Box>;
  })();

  const networkUtilization = getNetworkUtilizationParams(statsQueryResult.data?.network_utilization_percentage ?? 0);

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
        px={ 5 }
        py={ 4 }
        borderBottom="1px solid rgba(255, 255, 255, 0.05)" /* matching layout */
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="transparent"
      >
        <Heading
          as="h2"
          fontSize="15px"
          m={ 0 }
          fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
          className="text-telemetry"
          color="white"
          display="flex"
          alignItems="center"
          textTransform="uppercase"
          letterSpacing="0.02em"
          fontWeight="900"
        >
          <Box w="5px" h="5px" bg="rgba(229, 193, 88, 1)" mr={ 3 } shadow="none"/>
          LATEST BLOCKS
          { isRpcData && <Box ml={ 2 }><FallbackRpcIcon/></Box> }
        </Heading>

        <Link
          href={ route({ pathname: '/blocks' }) }
          fontSize="9px"
          className="text-telemetry"
          fontWeight={ 700 }
          color="#e5c158"
          _hover={{ color: 'white', borderColor: 'rgba(229, 193, 88, 0.3)' }}
          transition="colors 0.2s"
          px={ 3 } py={ 1.5 }
          bg="transparent"
          border="1px solid rgba(255, 255, 255, 0.1)"
          textTransform="uppercase"
          letterSpacing="0.1em"
          textDecoration="none !important"
        >
          VIEW ALL
        </Link>
      </Box>

      { statsQueryResult.data?.network_utilization_percentage !== undefined && (
        <Skeleton
          loading={ statsQueryResult.isPlaceholderData }
          mt={ 0 }
          p={ 3 }
          borderBottom="1px solid rgba(255,255,255,0.05)"
          bg="transparent"
          fontSize="xs"
          color="gray.400"
        >
          <Text
            as="span"
            fontFamily="'Space Mono', monospace, 'Inter', sans-serif"
            fontSize="10px"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="0.1em"
          >
            Network utilization:{ nbsp }
          </Text>
          <Tooltip content={ `${ upperFirst(networkUtilization.load) } load` }>
            <Text
              as="span"
              color={ networkUtilization.color }
              fontWeight={ 700 }
              fontFamily="'Space Mono', monospace, 'Inter', sans-serif"
              fontSize="11px"
              letterSpacing="0.1em"
            >
              { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%
            </Text>
          </Tooltip>
        </Skeleton>
      ) }

      { statsQueryResult.data?.celo && (
        <Box whiteSpace="pre-wrap" fontSize="xs" mt={ 0 } p={ 3 } borderBottom="1px solid rgba(255,255,255,0.05)" color="gray.400">
          <span>Current epoch: </span>
          <chakra.span fontWeight={ 700 }>#{ statsQueryResult.data.celo.epoch_number }</chakra.span>
        </Box>
      ) }

      <Box position="relative" flex={ 1 } overflow="hidden">
        { /* Shadow overlay matching Explorer.tsx bottom gradient */ }
        <Box
          position="absolute"
          bottom={ 0 }
          left={ 0 }
          right={ 0 }
          h={ 16 }
          bg="linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.8), transparent)"
          zIndex={ 10 }
          pointerEvents="none"
        />
        <Box maxH="600px" overflowY="auto" className="scrollbar-hide" py={ 2 } px={ 2 } display="flex" flexDir="column" gap={ 2 } position="relative">
          { content }
        </Box>
      </Box>
    </Box>
  );
};

export default LatestBlocks;
