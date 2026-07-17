import { Grid, GridItem } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import { publicClient } from 'lib/web3/client';
import { mdash } from 'toolkit/utils/htmlEntities';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';
import GasPrice from 'ui/shared/gas/GasPrice';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import { GWEI } from 'ui/shared/value/utils';

import { useMrdPriceQuery } from '../useMrdPriceQuery';
import type { HomeStatsItem } from '../utils';
import { isHomeStatsItemEnabled, sortHomeStatsItems } from '../utils';
import { useHomeRpcDataContext } from './rpcDataContext';

const StatsDegraded = () => {

  const [ averageBlockTime, setAverageBlockTime ] = React.useState<number | undefined>(undefined);

  const { blocks, isLoading, enable } = useHomeRpcDataContext();
  const mrdPriceQuery = useMrdPriceQuery();

  const gasPriceQuery = useQuery({
    queryKey: [ 'RPC', 'gas-price' ],
    queryFn: async() => {
      if (!publicClient) {
        return null;
      }
      return publicClient.getGasPrice();
    },
    select: (data) => {
      if (!data) {
        return null;
      }
      const price = BigNumber(data.toString()).div(GWEI).toNumber();
      return {
        price,
        fiat_price: null,
        time: null,
        base_fee: null,
        priority_fee: null,
      };
    },
    enabled: Boolean(publicClient),
  });

  React.useEffect(() => {
    enable(true, 'stats-widgets');
    return () => {
      enable(false, 'stats-widgets');
    };
  }, [ enable ]);

  React.useEffect(() => {
    if (blocks.length > 1) {
      const timeDiffs = blocks
        .map((block, index) => {
          if (index > 0) {
            return dayjs(blocks[index - 1].timestamp).diff(dayjs(block.timestamp), 'seconds');
          }
          return 0;
        })
        .slice(1);
      const totalDiff = timeDiffs.reduce((acc, diff) => acc + diff, 0);
      setAverageBlockTime((prev) => {
        if (prev === undefined) {
          return totalDiff / timeDiffs.length;
        }
        return (prev + totalDiff) / (timeDiffs.length + 1);
      });
    }
  }, [ blocks ]);

  const items: Array<HomeStatsItem> = (() => {
    return [
      {
        id: 'fc_price' as const,
        label: 'MRD Price',
        value: mrdPriceQuery.data?.value ?? mdash,
        subtext: mrdPriceQuery.data?.subtext,
        subtextColor: 'rgba(34, 197, 94, 1)',
        isFallback: true,
        isLoading: mrdPriceQuery.isLoading,
      },
      {
        id: 'latest_batch' as const,
        icon: 'txn_batches' as const,
        label: 'Latest batch',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'total_blocks' as const,
        icon: 'block' as const,
        label: 'Total blocks',
        value: blocks[0] ? blocks[0].height.toLocaleString() : mdash,
        isFallback: blocks[0] === undefined,
        hint: blocks[0] && !isLoading ? <FallbackRpcIcon/> : undefined,
      },
      {
        id: 'average_block_time' as const,
        icon: 'clock-light' as const,
        label: 'Average block time',
        value: averageBlockTime ? `${ averageBlockTime.toFixed(1) }s` : mdash,
        isFallback: averageBlockTime === undefined,
        hint: averageBlockTime && !isLoading ? <FallbackRpcIcon/> : undefined,
      },
      {
        id: 'total_txs' as const,
        icon: 'transactions' as const,
        label: 'Total transactions',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: 'Total operational transactions',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'latest_l1_state_batch' as const,
        icon: 'txn_batches' as const,
        label: 'Latest L1 state batch',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'wallet_addresses' as const,
        icon: 'wallet' as const,
        label: 'Wallet addresses',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'gas_tracker' as const,
        icon: 'gas' as const,
        label: 'Gas tracker',
        value: gasPriceQuery.data ? <GasPrice data={ gasPriceQuery.data }/> : mdash,
        isFallback: !gasPriceQuery.data,
        isLoading: gasPriceQuery.isLoading,
        hint: gasPriceQuery.data && !isLoading && !gasPriceQuery.isLoading ? <FallbackRpcIcon/> : undefined,
      },
      {
        id: 'btc_locked' as const,
        icon: 'coins/bitcoin' as const,
        label: 'BTC Locked in 2WP',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'current_epoch' as const,
        icon: 'hourglass' as const,
        label: 'Current epoch',
        value: mdash,
        isFallback: true,
      },
    ]
      .filter((item) => item.id === 'fc_price' || isHomeStatsItemEnabled(item))
      .sort((a, b) => {
        const priorityOrder = [ 'fc_price', 'total_blocks', 'total_txs', 'average_block_time' ];
        const aIndex = priorityOrder.indexOf(a.id);
        const bIndex = priorityOrder.indexOf(b.id);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return sortHomeStatsItems(a, b);
      });
  })();

  if (items.length === 0) {
    return null;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={{ base: 2, lg: 4 }}
      flexBasis="50%"
      flexGrow={ 1 }
      w="100%"
    >
      { items.map((item, index) => (
        <GridItem key={ item.id } colSpan={{ base: 1, lg: index >= 4 ? 2 : 1 }}>
          <StatsWidget
            { ...item }
            isLoading={ isLoading || item.isLoading }
          />
        </GridItem>
      )) }
    </Grid>

  );
};

export default React.memo(StatsDegraded);
