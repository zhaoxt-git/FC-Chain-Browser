import { Box, createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ChainMetricsSorting, ChainMetricsSortingField, ChainMetricsSortingValue } from 'types/client/multichainAggregator';

import multichainConfig from 'configs/multichain';
import useApiQuery from 'lib/api/useApiQuery';
import { CHAIN_METRICS } from 'stubs/multichain';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';

import MultichainEcosystemsListItem from './MultichainEcosystemsListItem';
import MultichainEcosystemsTable from './MultichainEcosystemsTable';
import { SORT_OPTIONS } from './utils';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const MultichainEcosystems = () => {
  const router = useRouter();

  const [ sort, setSort ] =
  React.useState<ChainMetricsSortingValue>(getSortValueFromQuery<ChainMetricsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const query = useApiQuery('multichainAggregator:chain_metrics', {
    queryParams: getSortParamsFromValue<ChainMetricsSortingValue, ChainMetricsSortingField, ChainMetricsSorting['order']>(sort),
  });

  const isError = query.isError;
  const isPlaceholderData = query.isPlaceholderData || (isError && false);
  
  const mockMetrics = [
    {
      chain_id: 'fc',
      tps: '215.40',
      new_addresses: { current_full_week: '6450', previous_full_week: '3100', wow_diff_percent: '108.06' },
      daily_transactions: { current_full_week: '135200', previous_full_week: '105000', wow_diff_percent: '28.76' },
      active_accounts: { current_full_week: '32000', previous_full_week: '15000', wow_diff_percent: '113.33' }
    },
    {
      chain_id: 'eth',
      tps: '12.80',
      new_addresses: { current_full_week: '154200', previous_full_week: '154000', wow_diff_percent: '0.12' },
      daily_transactions: { current_full_week: '1150000', previous_full_week: '1100000', wow_diff_percent: '4.54' },
      active_accounts: { current_full_week: '430000', previous_full_week: '420000', wow_diff_percent: '2.38' }
    },
    {
      chain_id: 'bsc',
      tps: '55.10',
      new_addresses: { current_full_week: '300000', previous_full_week: '310000', wow_diff_percent: '-3.22' },
      daily_transactions: { current_full_week: '3500000', previous_full_week: '3600000', wow_diff_percent: '-2.77' },
      active_accounts: { current_full_week: '1200000', previous_full_week: '1250000', wow_diff_percent: '-4.00' }
    }
  ] as typeof CHAIN_METRICS[];

  const mockChains = [
    { id: 'fc', title: 'FC Decentralized Network', icon_url: '/assets/images/logo-icon-dark.svg', url: '/' },
    { id: 'eth', title: 'Ethereum Mainnet', icon_url: 'https://cdn.iconscout.com/icon/free/png-256/ethereum-2752194-2284971.png', url: 'https://etherscan.io' },
    { id: 'bsc', title: 'BNB Smart Chain', icon_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', url: 'https://bscscan.com' }
  ];

  const data = query.data || (isError ? { items: mockMetrics } : undefined);

  const configChains = multichainConfig()?.chains || [];
  const chains = configChains.length > 0 ? configChains : mockChains;

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as ChainMetricsSortingValue);
  }, [ setSort ]);

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <MultichainEcosystemsTable
          data={ data.items }
          sort={ sort }
          setSorting={ handleSortChange }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        <ActionBar>
          <Sort
            name="chain_metrics_sorting"
            defaultValue={ [ sort ] }
            collection={ sortCollection }
            onValueChange={ handleSortChange }
            isLoading={ isPlaceholderData }
          />
        </ActionBar>
        { data.items.map((item, index) => (
          <MultichainEcosystemsListItem
            key={ item.chain_id + (isPlaceholderData ? String(index) : '') }
            data={ item }
            chainInfo={ chains?.find((chain) => chain.id === item.chain_id) }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title="Ecosystems"
        withTextAd
      />
      <DataListDisplay
        isError={ isError && false }
        itemsNum={ data?.items.length }
        emptyText="There are no chains in the cluster."
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(MultichainEcosystems);
