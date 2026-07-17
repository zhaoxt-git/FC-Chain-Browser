import { useAccount as useAccountReown } from 'wagmi';

import config from 'configs/app';
import useAccountDynamic from 'lib/web3/account/useAccountDynamic';
import useAccountFallback from 'lib/web3/account/useAccountFallback';

const feature = config.features.blockchainInteraction;

// eslint-disable-next-line no-nested-ternary
const useAccount = (feature.isEnabled && feature.connectorType === 'dynamic') ?
  useAccountDynamic :
  (feature.isEnabled && feature.connectorType === 'reown') ?
    useAccountReown :
    useAccountFallback;

export default useAccount;
