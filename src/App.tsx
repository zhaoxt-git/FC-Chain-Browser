import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { ReactElement } from 'react';

import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { MarketplaceContextProvider } from 'lib/contexts/marketplace';
import { SettingsContextProvider } from 'lib/contexts/settings';
import { SocketProvider } from 'lib/socket/context';
import { Provider as ChakraProvider } from 'toolkit/chakra/provider';
import { Toaster } from 'toolkit/chakra/toaster';
import Layout from 'ui/shared/layout/Layout';
import LayoutHome from 'ui/shared/layout/LayoutHome';
import LayoutSearchResults from 'ui/shared/layout/LayoutSearchResults';

import { getLocationSnapshot, subscribeToLocationChange } from './compat/navigation-events';
import { AppRoutes } from './routes';

const pageProps = {
  cookies: document.cookie,
  referrer: document.referrer,
  query: {},
  adBannerProvider: null,
  apiData: null,
  uuid: '',
};

export function App(): ReactElement {
  const queryClient = useQueryClientConfig();
  const snapshot = React.useSyncExternalStore(subscribeToLocationChange, getLocationSnapshot, getLocationSnapshot);
  const pathname = React.useMemo(() => new URL(snapshot, window.location.origin).pathname, [ snapshot ]);
  const PageLayout = (() => {
    if (pathname === '/') {
      return LayoutHome;
    }

    if (pathname === '/search-results') {
      return LayoutSearchResults;
    }

    return Layout;
  })();

  return (
    <ChakraProvider>
      <QueryClientProvider client={ queryClient }>
        <AppContextProvider pageProps={ pageProps }>
          <SocketProvider>
            <MarketplaceContextProvider>
              <SettingsContextProvider>
                <PageLayout>
                  <AppRoutes/>
                </PageLayout>
              </SettingsContextProvider>
            </MarketplaceContextProvider>
          </SocketProvider>
          <Toaster/>
        </AppContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
