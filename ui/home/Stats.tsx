import { Grid, GridItem } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { layerLabels } from 'lib/rollups/utils';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import { mdash } from 'toolkit/utils/htmlEntities';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import { WEI } from 'ui/shared/value/utils';

import StatsDegraded from './fallbacks/StatsDegraded';
import { formatMrdPriceChange } from './formatMrdPrice';
import { useMrdPriceQuery } from './useMrdPriceQuery';
import type { HomeStatsItem } from './utils';
import { isHomeStatsItemEnabled, sortHomeStatsItems } from './utils';

const rollupFeature = config.features.rollup;
const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';
const isStatsFeatureEnabled = config.features.stats.isEnabled;

const Stats = () => {
  const [ hasGasTracker, setHasGasTracker ] = React.useState(config.features.gasTracker.isEnabled);
  const mrdPriceQuery = useMrdPriceQuery();

  // data from stats microservice is prioritized over data from stats api
  const statsQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsFeatureEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsFeatureEnabled,
    },
  });

  const apiQuery = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const isPlaceholderData = statsQuery.isPlaceholderData || apiQuery.isPlaceholderData;

  React.useEffect(() => {
    if (!isPlaceholderData && !apiQuery.data?.gas_prices?.average) {
      setHasGasTracker(false);
    }
  // should run only after initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const zkEvmLatestBatchQuery = useApiQuery('general:homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const zkSyncLatestBatchQuery = useApiQuery('general:homepage_zksync_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const arbitrumLatestBatchQuery = useApiQuery('general:homepage_arbitrum_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && config.UI.homepage.stats.includes('latest_batch'),
    },
  });

  const latestBatchQuery = (() => {
    if (!rollupFeature.isEnabled || !config.UI.homepage.stats.includes('latest_batch')) {
      return;
    }

    switch (rollupFeature.type) {
      case 'zkEvm':
        return zkEvmLatestBatchQuery;
      case 'zkSync':
        return zkSyncLatestBatchQuery;
      case 'arbitrum':
        return arbitrumLatestBatchQuery;
    }
  })();

  if (apiQuery.isError || latestBatchQuery?.isError) {
    return <StatsDegraded/>;
  }

  const isLoading = isPlaceholderData || latestBatchQuery?.isPlaceholderData;

  const apiData = apiQuery.data;
  const statsData = statsQuery.data;

  const items: Array<HomeStatsItem> = (() => {
    if (!statsData && !apiData) {
      return [];
    }

    const hasAverageBlockTime = (
      statsData?.average_block_time?.value !== undefined && statsData.average_block_time.value !== null
    ) || (
      apiData?.average_block_time !== undefined && apiData.average_block_time !== null
    );
    const averageBlockTime = (
      statsData?.average_block_time?.value !== undefined && statsData.average_block_time.value !== null
    ) ?
      Number(statsData.average_block_time.value).toFixed(2) :
      `${ ((apiData?.average_block_time || 0) / 1000).toFixed(2) }s`;

    const gasInfoTooltip = hasGasTracker && apiData?.gas_prices && apiData.gas_prices.average ? (
      <GasInfoTooltip data={ apiData } dataUpdatedAt={ apiQuery.dataUpdatedAt }>
        <IconSvg
          isLoading={ isLoading }
          name="info"
          boxSize={ 5 }
          flexShrink={ 0 }
          cursor="pointer"
          color="icon.secondary"
          _hover={{ color: 'hover' }}
        />
      </GasInfoTooltip>
    ) : null;

    const rawItems: Array<HomeStatsItem | false | undefined | null | ''> = [
      {
        id: 'fc_price' as const,
        label: 'MRD Price',
        value: mrdPriceQuery.data?.value ?? mdash,
        subtext: mrdPriceQuery.data?.subtext ?? formatMrdPriceChange(apiData?.coin_price_change_percentage),
        subtextColor: 'rgba(34, 197, 94, 1)',
        isLoading: isLoading || mrdPriceQuery.isLoading,
      },
      latestBatchQuery?.data !== undefined && {
        id: 'latest_batch' as const,
        icon: 'txn_batches' as const,
        label: 'Latest batch',
        value: latestBatchQuery.data.toLocaleString(),
        href: { pathname: '/batches' as const },
        isLoading,
      },
      (statsData?.total_blocks?.value || apiData?.total_blocks) && {
        id: 'total_blocks' as const,
        icon: 'block' as const,
        label: 'Latest block',
        value: Number(statsData?.total_blocks?.value || apiData?.total_blocks).toLocaleString(),
        subtext: 'SYNCING LIVE...',
        href: { pathname: '/blocks' as const },
        isLoading,
      },
      hasAverageBlockTime && {
        id: 'average_block_time' as const,
        icon: 'clock-light' as const,
        label: 'Avg block time',
        subtext: 'REAL-TIME FINALITY',
        value: averageBlockTime,
        isLoading,
      },
      (statsData?.total_transactions?.value || apiData?.total_transactions) && {
        id: 'total_txs' as const,
        icon: 'transactions' as const,
        label: 'Network TPS',
        subtext: 'MAX: 65,000',
        value: Number(statsData?.total_transactions?.value || apiData?.total_transactions).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      (isArbitrumRollup && statsData?.total_operational_transactions?.value) && {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: statsData?.total_operational_transactions?.title || 'Total operational transactions',
        value: Number(statsData?.total_operational_transactions?.value).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      (isOptimisticRollup && statsData?.op_stack_total_operational_transactions?.value) && {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: statsData?.op_stack_total_operational_transactions?.title || 'Total operational transactions',
        value: Number(statsData?.op_stack_total_operational_transactions?.value).toLocaleString(),
        href: { pathname: '/txs' as const },
        isLoading,
      },
      apiData?.last_output_root_size && {
        id: 'latest_l1_state_batch' as const,
        icon: 'txn_batches' as const,
        label: `Latest ${ layerLabels.parent } state batch`,
        value: apiData?.last_output_root_size,
        href: { pathname: '/batches' as const },
        isLoading,
      },
      (statsData?.total_addresses?.value || apiData?.total_addresses) && {
        id: 'wallet_addresses' as const,
        icon: 'wallet' as const,
        label: statsData?.total_addresses?.title || 'Wallet addresses',
        value: Number(statsData?.total_addresses?.value || apiData?.total_addresses).toLocaleString(),
        isLoading,
      },
      hasGasTracker && apiData?.gas_prices && {
        id: 'gas_tracker' as const,
        icon: 'gas' as const,
        label: 'Gas tracker',
        value: apiData.gas_prices.average ? <GasPrice data={ apiData.gas_prices.average }/> : 'N/A',
        hint: gasInfoTooltip,
        isLoading,
      },
      apiData?.rootstock_locked_btc && {
        id: 'btc_locked' as const,
        icon: 'coins/bitcoin' as const,
        label: 'BTC Locked in 2WP',
        value: `${ BigNumber(apiData.rootstock_locked_btc).div(WEI).dp(0).toFormat() } RBTC`,
        isLoading,
      },
      apiData?.celo && {
        id: 'current_epoch' as const,
        icon: 'hourglass' as const,
        label: 'Current epoch',
        value: `#${ apiData.celo.epoch_number }`,
        href: { pathname: '/epochs/[number]' as const, query: { number: String(apiData.celo.epoch_number) } },
        isLoading,
      },
    ];

    const baseItems = rawItems
      .filter((item): item is HomeStatsItem => Boolean(item))
      .filter((item) => item.id === 'fc_price' || isHomeStatsItemEnabled(item))
      .sort((a, b) => {
        // Force MRD Price, Latest Block, Network TPS, Avg block time to the top in specific order
        const priorityOrder = [ 'fc_price', 'total_blocks', 'total_txs', 'average_block_time' ];
        const aIndex = priorityOrder.indexOf(a.id);
        const bIndex = priorityOrder.indexOf(b.id);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return sortHomeStatsItems(a, b);
      });

    return baseItems;
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
            isLoading={ isLoading }
          />
        </GridItem>
      )) }
    </Grid>

  );
};

export default Stats;
