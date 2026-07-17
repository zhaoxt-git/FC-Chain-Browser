import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { STATS_CHARTS_SECTION_GAS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useChartsConfig } from 'ui/shared/chart/config';

const GAS_PRICE_CHART_ID = 'averageGasPrice';
const isStatsFeatureEnabled = config.features.stats.isEnabled;

const GasTrackerChart = () => {
  const { data, isPlaceholderData } = useApiQuery('stats:lines', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: {
        sections: [ STATS_CHARTS_SECTION_GAS ],
      },
    },
  });

  const chartsConfig = useChartsConfig();

  const chart = data?.sections.map((section) => section.charts.find((c) => c.id === GAS_PRICE_CHART_ID)).filter(Boolean)?.[0] ||
    { id: GAS_PRICE_CHART_ID, title: 'Average gas price', description: 'Average gas price historical data', units: 'Gwei' };

  const mockItems = React.useMemo(() => {
    const items = [];
    let curBase = 0.4;
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const d2 = new Date();
      d2.setDate(d2.getDate() - i + 1);

      curBase = Math.abs(curBase + (Math.random() * 0.4 - 0.2));

      items.push({
        date: d,
        date_to: d2,
        value: Number(curBase.toFixed(2)),
        isApproximate: false,
      });
    }
    return items;
  }, []);

  const content = (() => {
    if (isPlaceholderData) {
      return <ContentLoader/>;
    }

    if (!chart) {
      return null;
    }

    const chartsData = [
      {
        id: chart.id,
        name: 'Gwei',
        items: mockItems,
        charts: chartsConfig,
        units: 'Gwei',
      },
    ];

    return (
      <ChartWidget
        isError={ false }
        charts={ chartsData }
        title={ chart.title }
        description={ chart.description }
        isLoading={ false }
        minH="320px"
        className="glass-panel"
      />
    );
  })();

  if (!chart && !isPlaceholderData) {
    return null;
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={ 6 }>
        <chakra.h3 textStyle="h3">Gas price history</chakra.h3>
        <Link href={ route({ pathname: '/stats', hash: 'gas' }) }>Charts & stats</Link>
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(GasTrackerChart);
