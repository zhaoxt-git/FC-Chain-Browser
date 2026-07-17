import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AlertWithExternalHtml from 'ui/shared/alerts/AlertWithExternalHtml';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.apiDocs;

const RestApi = React.lazy(async() => import('ui/apiDocs/RestApi'));
const EthRpcApi = React.lazy(async() => import('ui/apiDocs/EthRpcApi'));
const RpcApi = React.lazy(async() => import('ui/apiDocs/RpcApi'));
const GraphQL = React.lazy(async() => import('ui/apiDocs/GraphQL'));

interface ApiDocsTabContentProps {
  readonly activeTabId: string;
  readonly tabId: string;
  readonly children: React.ReactNode;
}

const ApiDocsTabContent = ({ activeTabId, tabId, children }: ApiDocsTabContentProps) => {
  if (activeTabId !== tabId) {
    return null;
  }

  return children;
};

const ApiDocs = () => {
  const router = useRouter();

  const tabFromQuery = typeof router.query.tab === 'string' && feature.tabs.includes(router.query.tab) ? router.query.tab : undefined;
  const defaultTabId = tabFromQuery || feature.tabs[0] || 'rest_api';
  const [ activeTabId, setActiveTabId ] = React.useState(defaultTabId);

  React.useEffect(() => {
    setActiveTabId(defaultTabId);
  }, [ defaultTabId ]);

  const handleTabChange = React.useCallback(({ value }: { value: string }) => {
    setActiveTabId(value);
  }, []);

  const tabs: Array<TabItemRegular> = [
    { id: 'rest_api', title: 'REST API', component: <ApiDocsTabContent activeTabId={ activeTabId } tabId="rest_api"><RestApi/></ApiDocsTabContent> },
    { id: 'eth_rpc_api', title: 'ETH RPC API', component: <ApiDocsTabContent activeTabId={ activeTabId } tabId="eth_rpc_api"><EthRpcApi/></ApiDocsTabContent> },
    { id: 'rpc_api', title: 'RPC API endpoints', component: <ApiDocsTabContent activeTabId={ activeTabId } tabId="rpc_api"><RpcApi/></ApiDocsTabContent> },
    { id: 'graphql_api', title: 'GraphQL API', component: <ApiDocsTabContent activeTabId={ activeTabId } tabId="graphql_api"><GraphQL/></ApiDocsTabContent> },
  ].filter(({ id }) => feature.isEnabled && feature.tabs.includes(id));

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } API documentation` : 'API documentation' }
      />
      { feature.isEnabled && feature.alertMessage ? <AlertWithExternalHtml html={ feature.alertMessage } status="info" showIcon mb={ 6 }/> : null }
      <React.Suspense fallback={ null }>
        { tabs.length > 0 ? <RoutedTabs tabs={ tabs } onValueChange={ handleTabChange }/> : <Text>No API documentation available</Text> }
      </React.Suspense>
    </>
  );
};

export default React.memo(ApiDocs);
