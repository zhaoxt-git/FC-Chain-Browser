import React from 'react';
import type { ReactElement } from 'react';

import config from 'configs/app';
import { MultichainProvider } from 'lib/contexts/multichain';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import AppError from 'ui/shared/AppError/AppError';

import { getLocationSnapshot, subscribeToLocationChange } from './compat/navigation-events';

type PageModule = {
  readonly 'default': React.ComponentType;
};

const notFoundError = Object.assign(new Error('Page not found'), { status: 404 });

const Blocks = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/blocks/MultichainBlocks');
  }

  return import('ui/pages/Blocks');
});

const Block = React.lazy(async(): Promise<PageModule> => import('ui/pages/Block'));

const MultichainBlock = React.lazy(async(): Promise<PageModule> => import('ui/multichain/block/MultichainBlock'));

const Address = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/address/MultichainAddress');
  }

  return import('ui/pages/Address');
});

const ContractVerificationForAddress = React.lazy(async(): Promise<PageModule> => import('ui/pages/ContractVerificationForAddress'));

const Transaction = React.lazy(async(): Promise<PageModule> => import('ui/pages/Transaction'));

const MultichainTx = React.lazy(async(): Promise<PageModule> => import('ui/multichain/tx/MultichainTx'));

const Transactions = React.lazy(async(): Promise<PageModule> => {
  if (config.features.zetachain.isEnabled) {
    return import('ui/pages/TransactionsZetaChain');
  }

  return import('ui/pages/Transactions');
});

const Tokens = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/tokens/MultichainTokens');
  }

  return import('ui/pages/Tokens');
});

const TokenTransfers = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/tokenTransfers/MultichainTokenTransfers');
  }

  return import('ui/pages/TokenTransfers');
});

const Token = React.lazy(async(): Promise<PageModule> => import('ui/pages/Token'));

const MultichainToken = React.lazy(async(): Promise<PageModule> => import('ui/multichain/token/MultichainToken'));

const TokenInstance = React.lazy(async(): Promise<PageModule> => import('ui/pages/TokenInstance'));

const MultichainTokenInstance = React.lazy(async(): Promise<PageModule> => import('ui/multichain/tokenInstance/MultichainTokenInstance'));

const InternalTxs = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/internalTxs/MultichainInternalTxs');
  }

  return import('ui/pages/InternalTxs');
});

const Accounts = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/accounts/MultichainAccounts');
  }

  return import('ui/pages/Accounts');
});

const GasTracker = React.lazy(async(): Promise<PageModule> => import('ui/pages/GasTracker'));

const HotContracts = React.lazy(async(): Promise<PageModule> => import('ui/pages/HotContracts'));

const ApiDocs = React.lazy(async(): Promise<PageModule> => import('ui/pages/ApiDocs'));

const ContractVerification = React.lazy(async(): Promise<PageModule> => import('ui/pages/ContractVerification'));

const PublicTagsSubmit = React.lazy(async(): Promise<PageModule> => import('ui/pages/PublicTagsSubmit'));

// const Ecosystems = React.lazy(async(): Promise<PageModule> => import('ui/multichain/ecosystems/MultichainEcosystems'));

const Uptime = React.lazy(async(): Promise<PageModule> => import('ui/megaEth/uptime/Uptime'));

const Home = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/home/MultichainHome');
  }

  return import('ui/pages/Home');
});

const Stats = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/stats/MultichainStats');
  }

  return import('ui/pages/Stats');
});

const SearchResults = React.lazy(async(): Promise<PageModule> => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/searchResults/SearchResults');
  }

  return import('ui/pages/SearchResults');
});

const Chart = React.lazy(async(): Promise<PageModule> => import('ui/pages/Chart'));

const ROUTE_TRANSITION_DELAY_MS = 120;

function ChartPage(): ReactElement {
  if (config.features.multichain.isEnabled) {
    return (
      <MultichainProvider>
        <Chart/>
      </MultichainProvider>
    );
  }

  return <Chart/>;
}

function getPage(pathname: string): React.ComponentType | null {
  switch (pathname) {
    case '/':
      return Home;

    case '/blocks':
      return Blocks;

    case '/block/[height_or_hash]':
      return Block;

    case '/chain/[chain_slug]/block/[height_or_hash]':
      return MultichainBlock;

    case '/address/[hash]':
      return Address;

    case '/address/[hash]/contract-verification':
      return ContractVerificationForAddress;

    case '/tx/[hash]':
      return Transaction;

    case '/chain/[chain_slug]/tx/[hash]':
      return MultichainTx;

    case '/txs':
      return Transactions;

    case '/tokens':
      return Tokens;

    case '/token-transfers':
      return TokenTransfers;

    case '/token/[hash]':
      return Token;

    case '/chain/[chain_slug]/token/[hash]':
      return MultichainToken;

    case '/token/[hash]/instance/[id]':
      return TokenInstance;

    case '/chain/[chain_slug]/token/[hash]/instance/[id]':
      return MultichainTokenInstance;

    case '/internal-txs':
      return InternalTxs;

    case '/accounts':
      return Accounts;

    case '/gas-tracker':
      return GasTracker;

    case '/hot-contracts':
      return HotContracts;

    case '/api-docs':
      return ApiDocs;

    case '/contract-verification':
      return ContractVerification;

    case '/public-tags/submit':
      return PublicTagsSubmit;

      // case '/ecosystems':
      //   return Ecosystems;

    case '/uptime':
      return Uptime;

    case '/stats':
      return Stats;

    case '/search-results':
      return SearchResults;

    default:
      if (/^\/block\/[^/]+$/.test(pathname)) {
        return Block;
      }

      if (/^\/chain\/[^/]+\/block\/[^/]+$/.test(pathname)) {
        return MultichainBlock;
      }

      if (/^\/address\/[^/]+$/.test(pathname)) {
        return Address;
      }

      if (/^\/address\/[^/]+\/contract-verification$/.test(pathname)) {
        return ContractVerificationForAddress;
      }

      if (/^\/tx\/[^/]+$/.test(pathname)) {
        return Transaction;
      }

      if (/^\/chain\/[^/]+\/tx\/[^/]+$/.test(pathname)) {
        return MultichainTx;
      }

      if (/^\/token\/[^/]+\/instance\/[^/]+$/.test(pathname)) {
        return TokenInstance;
      }

      if (/^\/chain\/[^/]+\/token\/[^/]+\/instance\/[^/]+$/.test(pathname)) {
        return MultichainTokenInstance;
      }

      if (/^\/token\/[^/]+$/.test(pathname)) {
        return Token;
      }

      if (/^\/chain\/[^/]+\/token\/[^/]+$/.test(pathname)) {
        return MultichainToken;
      }

      return pathname.startsWith('/stats/') ? ChartPage : null;
  }
}

export function AppRoutes(): ReactElement {
  const snapshot = React.useSyncExternalStore(subscribeToLocationChange, getLocationSnapshot, getLocationSnapshot);
  const pathname = React.useMemo(() => new URL(snapshot, window.location.origin).pathname, [ snapshot ]);
  const [ renderedPathname, setRenderedPathname ] = React.useState(pathname);

  React.useEffect(() => {
    if (renderedPathname === pathname) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRenderedPathname(pathname);
    }, ROUTE_TRANSITION_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [ pathname, renderedPathname ]);

  const isRouteTransitioning = renderedPathname !== pathname;
  const Page = getPage(renderedPathname);

  if (isRouteTransitioning) {
    return <ContentLoader mt={ 8 }/>;
  }

  return (
    <React.Suspense key={ renderedPathname } fallback={ <ContentLoader mt={ 8 }/> }>
      { Page ? <Page/> : <AppError error={ notFoundError }/> }
    </React.Suspense>
  );
}
