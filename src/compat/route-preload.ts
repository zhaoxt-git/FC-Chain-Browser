import config from 'configs/app';

const preloadedPathnames = new Set<string>();

function getPathname(href: string): string {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch (error) {
    return href.split('?')[0] ?? href;
  }
}

export function preloadRoute(href: string): void {
  const pathname = getPathname(href);

  if (preloadedPathnames.has(pathname)) {
    return;
  }

  preloadedPathnames.add(pathname);

  switch (pathname) {
    case '/':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/home/MultichainHome');
      } else {
        void import('ui/pages/Home');
      }
      break;

    case '/blocks':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/blocks/MultichainBlocks');
      } else {
        void import('ui/pages/Blocks');
      }
      break;

    case '/block/[height_or_hash]':
      void import('ui/pages/Block');
      break;

    case '/chain/[chain_slug]/block/[height_or_hash]':
      void import('ui/multichain/block/MultichainBlock');
      break;

    case '/address/[hash]':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/address/MultichainAddress');
      } else {
        void import('ui/pages/Address');
      }
      break;

    case '/address/[hash]/contract-verification':
      void import('ui/pages/ContractVerificationForAddress');
      break;

    case '/tx/[hash]':
      void import('ui/pages/Transaction');
      break;

    case '/chain/[chain_slug]/tx/[hash]':
      void import('ui/multichain/tx/MultichainTx');
      break;

    case '/txs':
      if (config.features.zetachain.isEnabled) {
        void import('ui/pages/TransactionsZetaChain');
      } else {
        void import('ui/pages/Transactions');
      }
      break;

    case '/tokens':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/tokens/MultichainTokens');
      } else {
        void import('ui/pages/Tokens');
      }
      break;

    case '/token-transfers':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/tokenTransfers/MultichainTokenTransfers');
      } else {
        void import('ui/pages/TokenTransfers');
      }
      break;

    case '/token/[hash]':
      void import('ui/pages/Token');
      break;

    case '/chain/[chain_slug]/token/[hash]':
      void import('ui/multichain/token/MultichainToken');
      break;

    case '/token/[hash]/instance/[id]':
      void import('ui/pages/TokenInstance');
      break;

    case '/chain/[chain_slug]/token/[hash]/instance/[id]':
      void import('ui/multichain/tokenInstance/MultichainTokenInstance');
      break;

    case '/internal-txs':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/internalTxs/MultichainInternalTxs');
      } else {
        void import('ui/pages/InternalTxs');
      }
      break;

    case '/accounts':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/accounts/MultichainAccounts');
      } else {
        void import('ui/pages/Accounts');
      }
      break;

    case '/gas-tracker':
      void import('ui/pages/GasTracker');
      break;

    case '/hot-contracts':
      void import('ui/pages/HotContracts');
      break;

    case '/api-docs':
      void import('ui/pages/ApiDocs');
      break;

    case '/contract-verification':
      void import('ui/pages/ContractVerification');
      break;

    case '/public-tags/submit':
      void import('ui/pages/PublicTagsSubmit');
      break;

      // case '/ecosystems':
      //   void import('ui/multichain/ecosystems/MultichainEcosystems');
      //   break;

    case '/uptime':
      void import('ui/megaEth/uptime/Uptime');
      break;

    case '/stats':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/stats/MultichainStats');
      } else {
        void import('ui/pages/Stats');
      }
      break;

    case '/search-results':
      if (config.features.multichain.isEnabled) {
        void import('ui/multichain/searchResults/SearchResults');
      } else {
        void import('ui/pages/SearchResults');
      }
      break;

    default:
      if (/^\/block\/[^/]+$/.test(pathname)) {
        void import('ui/pages/Block');
      } else if (/^\/chain\/[^/]+\/block\/[^/]+$/.test(pathname)) {
        void import('ui/multichain/block/MultichainBlock');
      } else if (/^\/address\/[^/]+$/.test(pathname)) {
        if (config.features.multichain.isEnabled) {
          void import('ui/multichain/address/MultichainAddress');
        } else {
          void import('ui/pages/Address');
        }
      } else if (/^\/address\/[^/]+\/contract-verification$/.test(pathname)) {
        void import('ui/pages/ContractVerificationForAddress');
      } else if (/^\/tx\/[^/]+$/.test(pathname)) {
        void import('ui/pages/Transaction');
      } else if (/^\/chain\/[^/]+\/tx\/[^/]+$/.test(pathname)) {
        void import('ui/multichain/tx/MultichainTx');
      } else if (/^\/token\/[^/]+\/instance\/[^/]+$/.test(pathname)) {
        void import('ui/pages/TokenInstance');
      } else if (/^\/chain\/[^/]+\/token\/[^/]+\/instance\/[^/]+$/.test(pathname)) {
        void import('ui/multichain/tokenInstance/MultichainTokenInstance');
      } else if (/^\/token\/[^/]+$/.test(pathname)) {
        void import('ui/pages/Token');
      } else if (/^\/chain\/[^/]+\/token\/[^/]+$/.test(pathname)) {
        void import('ui/multichain/token/MultichainToken');
      } else if (pathname.startsWith('/stats/')) {
        void import('ui/pages/Chart');
      } else {
        preloadedPathnames.delete(pathname);
      }
  }
}
