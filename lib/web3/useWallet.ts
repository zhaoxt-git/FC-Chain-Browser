import config from 'configs/app';
import useWalletDynamic from 'lib/web3/wallet/useWalletDynamic';
import useWalletFallback from 'lib/web3/wallet/useWalletFallback';
import useWalletReown from 'lib/web3/wallet/useWalletReown';

const feature = config.features.blockchainInteraction;

// eslint-disable-next-line no-nested-ternary
const useWallet = (feature.isEnabled && feature.connectorType === 'dynamic') ?
  useWalletDynamic :
  (feature.isEnabled && feature.connectorType === 'reown') ?
    useWalletReown :
    useWalletFallback;

export default useWallet;
