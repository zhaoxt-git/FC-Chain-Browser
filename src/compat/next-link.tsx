import React from 'react';

import { notifyLocationChange } from './navigation-events';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  readonly href: string | { pathname?: string; query?: Record<string, string | number | boolean | undefined> };
  readonly prefetch?: boolean;
  readonly replace?: boolean;
  readonly scroll?: boolean;
  readonly shallow?: boolean;
}

function hrefToString(href: LinkProps['href']): string {
  if (typeof href === 'string') {
    return href;
  }

  const url = href.pathname ?? '';

  if (!href.query) {
    return url;
  }

  const params = new URLSearchParams();
  Object.entries(href.query).forEach(([ key, value ]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `${ url }?${ query }` : url;
}

export default React.forwardRef<HTMLAnchorElement, LinkProps>(
  function NextLink({ href, replace, prefetch: _prefetch, scroll, shallow: _shallow, onClick, ...props }, ref) {
    const stringHref = hrefToString(href);
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey ||
        stringHref.startsWith('http')
      ) {
        return;
      }

      event.preventDefault();
      if (replace) {
        window.history.replaceState(null, '', stringHref);
      } else {
        window.history.pushState(null, '', stringHref);
      }
      notifyLocationChange();

      if (scroll !== false) {
        window.scrollTo(0, 0);
      }
    }, [ onClick, replace, scroll, stringHref ]);

    return (
      <a
        ref={ ref }
        href={ stringHref }
        onClick={ handleClick }
        { ...props }
      />
    );
  },
);
