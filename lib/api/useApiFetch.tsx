import { useQueryClient } from '@tanstack/react-query';
import { omit, pickBy } from 'es-toolkit';
import React from 'react';

import type { CsrfData } from 'types/client/account';
import type { ExternalChainExtended } from 'types/externalChains';

import isBodyAllowed from 'lib/api/isBodyAllowed';
import isNeedProxy from 'lib/api/isNeedProxy';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import buildUrl from './buildUrl';
import getResourceParams from './getResourceParams';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined | null>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal' | 'headers'>;
  logError?: boolean;
  chain?: ExternalChainExtended;
}

export default function useApiFetch() {
  const fetch = useFetch();
  const queryClient = useQueryClient();

  const { token: csrfToken } = queryClient.getQueryData<CsrfData>(getResourceKey('general:csrf')) || {};

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams, logError, chain }: Params<R> = {},
  ) => {
    const apiToken = cookies.get(cookies.NAMES.API_TOKEN);
    const rewardsApiToken = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);
    const apiTempToken = cookies.get(cookies.NAMES.API_TEMP_TOKEN);
    const showScamTokens = cookies.get(cookies.NAMES.SHOW_SCAM_TOKENS) === 'true';

    const { api, apiName, resource } = getResourceParams(resourceName, chain);
    const url = buildUrl(resourceName, pathParams, queryParams, undefined, chain);
    const withBody = isBodyAllowed(fetchParams?.method);
    const headers = pickBy({
      'x-endpoint': isNeedProxy() ? api.endpoint : undefined,
      Authorization: [ 'admin', 'contractInfo' ].includes(apiName) ? apiToken : undefined,
      'x-csrf-token': [ 'general', 'admin', 'contractInfo' ].includes(apiName) && withBody && csrfToken ? csrfToken : undefined,
      ...(apiName === 'general' ? {
        'api-v2-temp-token': apiTempToken,
        'show-scam-tokens': showScamTokens ? 'true' : undefined,
      } : {}),
      ...(apiName === 'rewards' && rewardsApiToken ? {
        Authorization: `Bearer ${ rewardsApiToken }`,
      } : {}),
      ...resource.headers,
      ...fetchParams?.headers,
    }, Boolean) as HeadersInit;

    if (apiName === 'stats') {
      if (resourceName === 'stats:counters') {
        const mockCounters = { 
          counters: [
            { id: 'avg_block_time', title: 'Avg Block Time', value: '2.14', units: 's', description: 'Average time between blocks' },
            { id: 'total_blocks', title: 'Total Blocks', value: '4520102', description: 'Total blocks on chain' },
            { id: 'total_txs', title: 'Total Trxs', value: '34510123', description: 'Total transactions' },
            { id: 'wallet_addresses', title: 'Wallet Accounts', value: '1452001', description: 'Total wallet addresses' },
            { id: 'daily_txs', title: 'Daily Trxs', value: '142510', description: 'Transactions today' },
            { id: 'gas_avg', title: 'Avg Gas Price', value: '0.01', units: 'Gwei', description: 'Average gas price' },
            { id: 'active_nodes', title: 'Active Validators', value: '24', description: 'Online validators' },
            { id: 'smart_contracts', title: 'Smart Contracts', value: '15400', description: 'Deployed contracts' }
          ]
        };
        return Promise.resolve(mockCounters) as unknown as Promise<SuccessType>;
      }
      if (resourceName === 'stats:line') {
        const mockChartData = Array.from({ length: 30 }).map((_, i) => ({ 
          date: new Date(Date.now() - i * 86400000).toISOString(), 
          date_to: new Date(Date.now() - (i-1) * 86400000).toISOString(), 
          value: String(Math.floor(Math.random() * 100000 + 50000)),
          is_approximate: false
        })).reverse();
        
        const mockLine = {
          chart: mockChartData,
          info: { 
            id: pathParams && 'id' in pathParams ? pathParams.id as string : 'telemetry', 
            title: 'DATA FEED', 
            description: 'Encrypted telemetry datastream', 
            units: 'count', 
            resolutions: ['DAY', 'WEEK'] 
          }
        };
        return Promise.resolve(mockLine) as unknown as Promise<SuccessType>;
      }
      if (resourceName === 'stats:lines') {
        const mockLines = {
          sections: [
            {
              id: "core", title: "Core Telemetry", charts: [
                { id: "txnsFee", title: "Transaction Fees", description: "Daily fee usage" },
                { id: "activeAccounts", title: "Active Accounts", description: "Active users dynamically" },
                { id: "newBlocks", title: "Block Creation", description: "New blocks mined" }
              ]
            },
            {
              id: "network", title: "Network Datastream", charts: [
                { id: "gasUsed", title: "Gas Utilization", description: "Gas utilized over time" },
                { id: "contractCalls", title: "Smart Contract Activity", description: "Contract calls dynamically" }
              ]
            }
          ]
        };
        return Promise.resolve(mockLines) as unknown as Promise<SuccessType>;
      }
      if (resourceName === 'stats:pages_main') {
        // Return undefined to force fallback to the true general data API for FC Chain
        return Promise.resolve({}) as unknown as Promise<SuccessType>;
      }
    }

    return fetch<SuccessType, ErrorType>(
      url,
      {
        // Things to remember:
        //
        // A: Currently, we use only one API-related cookie, "_explorer_key," which is for the account feature.
        // We include credentials only for core API requests.
        // Note that some APIs may share the same origin with the core API, but they don't require credentials (e.g the Stats API).
        //
        // B: We cannot limit the routes for which credentials should be sent exclusively to the "/account/**" routes.
        // This is because the watchlist names and private tags preloading will not function on the API side.
        // Therefore, we include credentials for all core API routes.
        //
        // C: We cannot include credentials in cross-origin requests.
        // In this case, we must explicitly list all the origins allowed to make requests in the "Access-Control-Allow-Origin" header,
        // which is challenging for our devops and backend teams. Thus, we do not use the "include" option here.
        // And because of this, the account feature in cross-origin setup will not work.
        //
        // Considering all of the above, we use:
        //   -  The "same-origin" option for all core API requests
        //   -  The "omit" option for all other requests
        credentials: apiName === 'general' ? 'same-origin' : 'omit',
        headers,
        ...(fetchParams ? omit(fetchParams, [ 'headers' ]) : {}),
      },
      {
        resource: resource.path,
        logError,
      },
    );
  }, [ fetch, csrfToken ]);
}
