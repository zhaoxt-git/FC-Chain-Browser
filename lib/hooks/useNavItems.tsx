import { useRouter } from 'next/router';
import React from 'react';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { rightLineArrow } from 'toolkit/utils/htmlEntities';

const marketplaceFeature = config.features.marketplace;
const beaconChainFeature = config.features.beaconChain;

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
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
      icon: 'navigation/top_accounts',
      isActive: pathname === '/accounts',
    };
    const blocks: NavItem | null = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: 'navigation/block',
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]' || pathname === '/chain/[chain_slug]/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: 'navigation/transactions',
      isActive:
        // sorry, but this is how it was designed
        (pathname === '/txs' && (!tab || (!tab.includes('cctx') && !tab.includes('txs_cross_chain')))) ||
        pathname === '/tx/[hash]' ||
        pathname === '/chain/[chain_slug]/tx/[hash]',
    };
    const cctxs: NavItem | null = {
      text: 'Cross-chain transactions',
      nextRoute: { pathname: '/txs' as const, query: { tab: 'txs_cross_chain' } },
      icon: 'navigation/cross_chain_txs',
      isActive: pathname === '/cc/tx/[hash]' || (pathname === '/txs' && (tab?.includes('cctx') || tab?.includes('txs_cross_chain'))),
    };
    const operations: NavItem | null = {
      text: 'Operations',
      nextRoute: { pathname: '/operations' as const },
      icon: 'navigation/operation',
      isActive: pathname === '/operations' || pathname === '/operation/[id]',
    };
    const internalTxs: NavItem | null = {
      text: 'Internal transactions',
      nextRoute: { pathname: '/internal-txs' as const },
      icon: 'navigation/internal_txns',
      isActive: pathname === '/internal-txs',
    };
    const userOps: NavItem | null = {
      text: 'User operations',
      nextRoute: { pathname: '/ops' as const },
      icon: 'navigation/user_op',
      isActive: pathname === '/ops' || pathname === '/op/[hash]' || pathname === '/chain/[chain_slug]/op/[hash]',
    };

    const verifiedContracts: NavItem | null =
     {
       text: 'Verified contracts',
       nextRoute: { pathname: '/verified-contracts' as const },
       icon: 'navigation/verified_contracts',
       isActive: pathname === '/verified-contracts',
     };
    const nameLookup = {
      text: 'Name services lookup',
      nextRoute: { pathname: '/name-services' as const },
      icon: 'navigation/public_tags',
      isActive: pathname.startsWith('/name-services'),
    };
    const validators = {
      text: 'Validators',
      nextRoute: { pathname: '/validators' as const },
      icon: 'navigation/validator',
      isActive: pathname === '/validators' || pathname === '/validators/[id]',
    };
    const rollupDeposits = null;
    const rollupWithdrawals = null;
    const rollupTxnBatches = {
      text: 'Txn batches',
      nextRoute: { pathname: '/batches' as const },
      icon: 'navigation/txn_batches',
      isActive: pathname === '/batches',
    };
    const rollupOutputRoots = {
      text: 'Output roots',
      nextRoute: { pathname: '/output-roots' as const },
      icon: 'navigation/output_roots',
      isActive: pathname === '/output-roots',
    };
    const rollupDisputeGames = null;
    const mudWorlds = {
      text: 'MUD worlds',
      nextRoute: { pathname: '/mud-worlds' as const },
      icon: 'navigation/mud',
      isActive: pathname === '/mud-worlds',
    };
    const epochs = {
      text: 'Epochs',
      nextRoute: { pathname: '/epochs' as const },
      icon: 'navigation/hourglass',
      isActive: pathname.startsWith('/epochs'),
    };

    const rollupFeature = config.features.rollup;

    const rollupInteropMessages = rollupFeature.isEnabled && rollupFeature.interopEnabled ? {
      text: 'Interop messages',
      nextRoute: { pathname: '/interop-messages' as const },
      icon: 'navigation/cross_chain_txs',
      isActive: pathname === '/interop-messages',
    } : null;

    if (rollupFeature.isEnabled && (
      rollupFeature.type === 'optimistic' ||
      rollupFeature.type === 'arbitrum' ||
      rollupFeature.type === 'zkEvm' ||
      rollupFeature.type === 'scroll'
    )) {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
          rollupInteropMessages,
        ].filter(Boolean),
        [
          blocks,
          epochs,
          // currently, transaction batches are not implemented for Celo
          !config.features.celo.isEnabled ? rollupTxnBatches : undefined,
          rollupDisputeGames,
          rollupFeature.outputRootsEnabled ? rollupOutputRoots : undefined,
        ].filter(Boolean),
        [
          userOps,
          topAccounts,
          mudWorlds,
          validators,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
        ],
        [
          blocks,
          userOps,
          topAccounts,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'zkSync') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          userOps,
          blocks,
          rollupTxnBatches,
        ].filter(Boolean),
        [
          topAccounts,
          validators,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        operations,
        internalTxs,
        cctxs,
        userOps,
        blocks,
        topAccounts,
        validators,
        verifiedContracts,
        nameLookup,
      ].filter(Boolean);
    }

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
      {
        text: 'DEX tracker',
        nextRoute: { pathname: '/pools' as const },
        icon: 'navigation/dex_tracker',
        isActive: pathname === '/pools' || pathname.startsWith('/pool/'),
      },
    ].filter(Boolean);

    const statsNavItem: NavGroupItem | null = (() => {
      const megaEthFeature = config.features.megaEth;

      const items = [
        {
          text: 'Chain stats',
          nextRoute: { pathname: '/stats' as const },
          icon: 'navigation/chain_stats',
          isActive: pathname.startsWith('/stats'),
        },
        {
          text: 'Ecosystems',
          nextRoute: { pathname: '/ecosystems' as const },
          icon: 'navigation/ecosystems',
          isActive: pathname.startsWith('/ecosystems'),
        },
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
        {
          text: 'Gas tracker',
          nextRoute: { pathname: '/gas-tracker' as const },
          icon: 'navigation/gas_tracker',
          isActive: pathname.startsWith('/gas-tracker'),
        },
      ].filter(Boolean);

      if (items.length === 0) {
        return null;
      }

      return {
        text: 'Charts & stats',
        nextRoute: { pathname: '/stats' as const },
        icon: 'navigation/stats',
        isActive: items.some(item => isInternalItem(item) && item.isActive),
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
      {
        text: 'Txn withdrawals',
        nextRoute: { pathname: '/txn-withdrawals' as const },
        icon: 'navigation/cross_chain_txs',
        isActive: pathname.startsWith('/txn-withdrawals'),
      },
      ...config.UI.navigation.otherLinks,
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: 'Blockchain',
        icon: 'navigation/blockchain' as const,
        isActive: blockchainNavItems.flat().some(item => item && isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: 'Tokens',
        icon: 'navigation/tokens' as const,
        isActive: tokensNavItems.flat().some(item => item && isInternalItem(item) && item.isActive),
        subItems: tokensNavItems,
      },
      marketplaceFeature.isEnabled ? {
        text: marketplaceFeature.titles.menu_item,
        nextRoute: { pathname: '/apps' as const },
        icon: 'navigation/apps' as const,
        isActive: pathname.startsWith('/app') || pathname.startsWith('/essential-dapps'),
      } : null,
      statsNavItem,
      apiNavItem,
      {
        text: 'Other',
        icon: 'navigation/other' as const,
        isActive: otherNavItems.flat().some(item => item && isInternalItem(item) && item.isActive),
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
