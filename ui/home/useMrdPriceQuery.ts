import { useQuery } from '@tanstack/react-query';

import { formatMrdPriceChange, formatMrdPriceFromEthPrice } from './formatMrdPrice';

const ETH_STATS_URL = 'https://eth.blockscout.com/api/v2/stats';
const PRICE_STALE_TIME = 60 * 1000;
const PRICE_REFETCH_INTERVAL = 5 * 60 * 1000;

interface EthBlockscoutStatsResponse {
  readonly coin_price?: string | null;
  readonly coin_price_change_percentage?: number | null;
}

export interface MrdPriceData {
  readonly value?: string;
  readonly subtext?: string;
}

async function fetchEthStats(): Promise<EthBlockscoutStatsResponse> {
  const response = await fetch(ETH_STATS_URL, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`ETH stats request failed with ${ response.status }`);
  }

  return await response.json() as EthBlockscoutStatsResponse;
}

function selectMrdPrice(data: EthBlockscoutStatsResponse): MrdPriceData {
  return {
    value: formatMrdPriceFromEthPrice(data.coin_price),
    subtext: formatMrdPriceChange(data.coin_price_change_percentage),
  };
}

export function useMrdPriceQuery() {
  return useQuery({
    queryKey: [ 'external', 'eth-blockscout-stats', 'mrd' ],
    queryFn: fetchEthStats,
    select: selectMrdPrice,
    staleTime: PRICE_STALE_TIME,
    refetchInterval: PRICE_REFETCH_INTERVAL,
    retry: 1,
  });
}
