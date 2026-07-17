import BigNumber from 'bignumber.js';

const MRD_TO_ETH_PRICE_RATIO = 100;

function formatUsdPrice(value: BigNumber): string {
  return `$${ value.toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }) }`;
}

export function formatMrdPriceFromEthPrice(ethPrice?: number | string | null): string | undefined {
  if (ethPrice === undefined || ethPrice === null || ethPrice === '') {
    return;
  }

  const price = BigNumber(ethPrice);

  if (!price.isFinite()) {
    return;
  }

  return formatUsdPrice(price.div(MRD_TO_ETH_PRICE_RATIO));
}

export function formatMrdPriceChange(changePercentage?: number | null): string | undefined {
  if (!Number.isFinite(changePercentage)) {
    return;
  }

  const value = changePercentage;
  const sign = value && value > 0 ? '+' : '';

  return `${ sign }${ value.toLocaleString(undefined, { maximumFractionDigits: 2 }) }% (24h)`;
}
