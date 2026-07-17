import { useRouter } from 'next/router';
import React from 'react';

import type {
  NavItemInternal,
  NavItem,
  NavGroupItem,
} from 'types/client/navigation';

import config from 'configs/app';

const marketplaceFeature = config.features.marketplace;

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
}

export function isGroupItem(
  item: NavItem | NavGroupItem,
): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;
  const query = router.query;
  const tab = query.tab;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = {
      text: 'Top accounts',
      nextRoute: { pathname: '/accounts' as const },
      // icon: 'navigation\\top_accounts',
      icon: 'navigation/top_accounts',
      isActive: pathname === '/accounts',
    };
    const blocks: NavItem | null = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: 'navigation/block',
      isActive:
        pathname === '/blocks' ||
        pathname === '/block/[height_or_hash]' ||
        pathname === '/chain/[chain_slug]/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: 'navigation/transactions',
      isActive:
        // sorry, but this is how it was designed
        (pathname === '/txs' &&
          (!tab ||
            (!tab.includes('cctx') && !tab.includes('txs_cross_chain')))) ||
        pathname === '/tx/[hash]' ||
        pathname === '/chain/[chain_slug]/tx/[hash]',
    };
    const internalTxs: NavItem | null = {
      text: 'Internal transactions',
      nextRoute: { pathname: '/internal-txs' as const },
      icon: 'navigation/internal_txns',
      isActive: pathname === '/internal-txs',
    };

    blockchainNavItems = [
      txs,
      internalTxs,
      blocks,
      topAccounts,
      // Operations,
      // Cross-chain transactions,
      // User operations,
      // Validators,
      // Verified contracts,
      // Name services lookup,
      // Rollup-specific links,
    ].filter(Boolean);

    const tokensNavItems = [
      {
        text: 'Tokens',
        nextRoute: { pathname: '/tokens' as const },
        icon: 'navigation/tokens',
        isActive: pathname === '/tokens' || pathname.startsWith('/token/'),
      },
      {
        text: 'Token transfers',
        nextRoute: { pathname: '/token-transfers' as const },
        icon: 'navigation/token_transfers',
        isActive: pathname === '/token-transfers',
      },
      // DEX tracker,
    ].filter(Boolean);

    const gasTrackerNavItem: NavItem = {
      text: 'Gas tracker',
      nextRoute: { pathname: '/gas-tracker' as const },
      icon: 'navigation/gas_tracker',
      isActive: pathname.startsWith('/gas-tracker'),
    };

    const statsNavItem: NavGroupItem | null = (() => {
      const items = [
        // {
        //   text: 'Chain stats',
        //   nextRoute: { pathname: '/stats' as const },
        //   icon: 'navigation/chain_stats',
        //   isActive: pathname.startsWith('/stats'),
        // },
        // {
        //   text: 'Ecosystems',
        //   nextRoute: { pathname: '/ecosystems' as const },
        //   icon: 'navigation/ecosystems',
        //   isActive: pathname.startsWith('/ecosystems'),
        // },
        {
          text: 'Uptime',
          nextRoute: { pathname: '/uptime' as const },
          icon: 'navigation/uptime',
          isActive: pathname.startsWith('/uptime'),
        },
        {
          text: 'Hot contracts',
          nextRoute: { pathname: '/hot-contracts' as const },
          icon: 'navigation/hot_contracts',
          isActive: pathname.startsWith('/hot-contracts'),
        },
      ].filter(Boolean);

      if (items.length === 0) {
        return null;
      }

      return {
        text: 'Charts & stats',
        icon: 'navigation/stats',
        isActive: items.some((item) => isInternalItem(item) && item.isActive),
        subItems: items,
      };
    })();

    const apiNavItem: NavItem | null = {
      text: 'API',
      nextRoute: { pathname: '/api-docs' as const },
      icon: 'navigation/api_docs',
      isActive: pathname.startsWith('/api-docs'),
    };

    const otherNavItems: Array<NavItem> | Array<Array<NavItem>> = [
      {
        text: 'Verify contract',
        nextRoute: { pathname: '/contract-verification' as const },
        icon: 'navigation/verified_contracts',
        isActive: pathname.startsWith('/contract-verification'),
      },
      {
        text: 'Submit public tag',
        nextRoute: { pathname: '/public-tags/submit' as const },
        icon: 'navigation/private_tags',
        isActive: pathname.startsWith('/public-tags/submit'),
      },
      config.features.rollup.isEnabled &&
      config.features.rollup.type === 'arbitrum' ?
        {
          text: 'Txn withdrawals',
          nextRoute: { pathname: '/txn-withdrawals' as const },
          icon: 'navigation/cross_chain_txs',
          isActive: pathname.startsWith('/txn-withdrawals'),
        } :
        null,
      gasTrackerNavItem,
      ...config.UI.navigation.otherLinks,
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: 'Blockchain',
        icon: 'navigation/blockchain' as const,
        isActive: blockchainNavItems
          .flat()
          .some((item) => item && isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: 'Tokens',
        icon: 'navigation/tokens' as const,
        isActive: tokensNavItems
          .flat()
          .some((item) => item && isInternalItem(item) && item.isActive),
        subItems: tokensNavItems,
      },
      marketplaceFeature.isEnabled ?
        {
          text: marketplaceFeature.titles.menu_item,
          nextRoute: { pathname: '/apps' as const },
          icon: 'navigation/apps' as const,
          isActive:
              pathname.startsWith('/app') ||
              pathname.startsWith('/essential-dapps'),
        } :
        null,
      statsNavItem,
      apiNavItem,
      {
        text: 'Other',
        icon: 'navigation/other' as const,
        isActive: otherNavItems
          .flat()
          .some((item) => item && isInternalItem(item) && item.isActive),
        subItems: otherNavItems,
      },
    ].filter(Boolean) as ReturnType['mainNavItems'];

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'navigation/watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'navigation/private_tags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'navigation/api_keys',
        isActive: pathname === '/account/api-key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'navigation/custom_abi',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'navigation/verified_contracts',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    return { mainNavItems, accountNavItems };
  }, [ pathname, tab ]);
}
