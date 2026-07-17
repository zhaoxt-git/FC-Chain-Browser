import React from 'react';

import { getLocationSnapshot, notifyLocationChange, subscribeToLocationChange } from './navigation-events';

type Url = string | {
  readonly pathname?: string;
  readonly query?: Record<string, string | number | boolean | undefined>;
  readonly hash?: string;
};

interface NavigateOptions {
  readonly scroll?: boolean;
  readonly shallow?: boolean;
}

interface RouteMatch {
  readonly pathname: string;
  readonly query: Record<string, string>;
}

export interface NextRouterCompat {
  readonly pathname: string;
  readonly asPath: string;
  readonly query: Record<string, string>;
  readonly isReady: boolean;
  push: (url: Url, as?: Url, options?: NavigateOptions) => Promise<boolean>;
  replace: (url: Url, as?: Url, options?: NavigateOptions) => Promise<boolean>;
  back: () => void;
  events: {
    on: () => void;
    off: () => void;
    emit: () => void;
  };
}

const ROUTE_MATCHERS: Array<{
  readonly pathname: string;
  readonly pattern: RegExp;
  readonly params: ReadonlyArray<string>;
}> = [
  {
    pathname: '/block/[height_or_hash]',
    pattern: /^\/block\/([^/]+)$/,
    params: [ 'height_or_hash' ],
  },
  {
    pathname: '/chain/[chain_slug]/block/[height_or_hash]',
    pattern: /^\/chain\/([^/]+)\/block\/([^/]+)$/,
    params: [ 'chain_slug', 'height_or_hash' ],
  },
  {
    pathname: '/address/[hash]/contract-verification',
    pattern: /^\/address\/([^/]+)\/contract-verification$/,
    params: [ 'hash' ],
  },
  {
    pathname: '/address/[hash]',
    pattern: /^\/address\/([^/]+)$/,
    params: [ 'hash' ],
  },
  {
    pathname: '/tx/[hash]',
    pattern: /^\/tx\/([^/]+)$/,
    params: [ 'hash' ],
  },
  {
    pathname: '/chain/[chain_slug]/tx/[hash]',
    pattern: /^\/chain\/([^/]+)\/tx\/([^/]+)$/,
    params: [ 'chain_slug', 'hash' ],
  },
  {
    pathname: '/token/[hash]/instance/[id]',
    pattern: /^\/token\/([^/]+)\/instance\/([^/]+)$/,
    params: [ 'hash', 'id' ],
  },
  {
    pathname: '/chain/[chain_slug]/token/[hash]/instance/[id]',
    pattern: /^\/chain\/([^/]+)\/token\/([^/]+)\/instance\/([^/]+)$/,
    params: [ 'chain_slug', 'hash', 'id' ],
  },
  {
    pathname: '/token/[hash]',
    pattern: /^\/token\/([^/]+)$/,
    params: [ 'hash' ],
  },
  {
    pathname: '/chain/[chain_slug]/token/[hash]',
    pattern: /^\/chain\/([^/]+)\/token\/([^/]+)$/,
    params: [ 'chain_slug', 'hash' ],
  },
  {
    pathname: '/stats/[id]',
    pattern: /^\/stats\/([^/]+)$/,
    params: [ 'id' ],
  },
];

function getRouteMatch(pathname: string): RouteMatch {
  const routeMatcher = ROUTE_MATCHERS.find(({ pattern }) => pattern.test(pathname));

  if (!routeMatcher) {
    return {
      pathname,
      query: {},
    };
  }

  const match = routeMatcher.pattern.exec(pathname);

  if (!match) {
    return {
      pathname,
      query: {},
    };
  }

  return {
    pathname: routeMatcher.pathname,
    query: Object.fromEntries(
      routeMatcher.params.map((param, index) => [ param, decodeURIComponent(match[index + 1] || '') ]),
    ),
  };
}

function getQuery(pathname: string): Record<string, string> {
  return {
    ...Object.fromEntries(new URLSearchParams(window.location.search).entries()),
    ...getRouteMatch(pathname).query,
  };
}

function applyDynamicRouteParams(pathname: string, params: URLSearchParams): string {
  return pathname.replace(/\[([^\]]+)\]/g, (segment, param: string) => {
    const value = params.get(param);

    if (value === null) {
      return segment;
    }

    params.delete(param);
    return encodeURIComponent(value);
  });
}

function formatUrl(url: Url): string {
  if (typeof url === 'string') {
    return url;
  }

  const currentRoute = getRouteMatch(window.location.pathname);
  const pathname = url.pathname ?? currentRoute.pathname;
  const params = new URLSearchParams();

  url.query && Object.entries(url.query).forEach(([ key, value ]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const generatedPathname = applyDynamicRouteParams(pathname, params);
  const query = params.toString();
  return `${ generatedPathname }${ query ? `?${ query }` : '' }${ url.hash ?? '' }`;
}

function navigate(url: Url, as?: Url, replace?: boolean, options?: NavigateOptions): Promise<boolean> {
  const nextUrl = formatUrl(as ?? url);

  if (replace) {
    window.history.replaceState(null, '', nextUrl);
  } else {
    window.history.pushState(null, '', nextUrl);
  }

  notifyLocationChange();

  if (options?.scroll !== false) {
    window.scrollTo(0, 0);
  }

  return Promise.resolve(true);
}

export function useRouter(): NextRouterCompat {
  const snapshot = React.useSyncExternalStore(subscribeToLocationChange, getLocationSnapshot, getLocationSnapshot);

  return React.useMemo(() => {
    const routeMatch = getRouteMatch(window.location.pathname);

    return {
      pathname: routeMatch.pathname,
      asPath: snapshot,
      query: getQuery(window.location.pathname),
      isReady: true,
      push: (url, as, options) => navigate(url, as, false, options),
      replace: (url, as, options) => navigate(url, as, true, options),
      back: () => window.history.back(),
      events: {
        on: () => undefined,
        off: () => undefined,
        emit: () => undefined,
      },
    };
  }, [ snapshot ]);
}
