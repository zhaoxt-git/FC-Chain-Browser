import config from 'configs/app';
import type { Unit } from 'ui/shared/value/utils';

import { formatMeridianBrandText } from './brand/formatMeridianBrandText';

const weiName = config.chain.currency.weiName || 'wei';
const gweiName = config.chain.currency.gweiName || `G${ weiName }`;
const currencySymbol = config.chain.currency.symbol ? formatMeridianBrandText(config.chain.currency.symbol) : 'ETH';

export const currencyUnits: Record<Unit, string> = {
  wei: weiName,
  gwei: gweiName,
  ether: currencySymbol,
};
