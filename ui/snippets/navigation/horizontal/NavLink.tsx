import { chakra } from '@chakra-ui/react';
import React from 'react';
import { preloadRoute } from 'src/compat/route-preload';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';

interface Props {
  className?: string;
  item: NavItem;
  noIcon?: boolean;
}

const NavLink = ({ className, item, noIcon }: Props) => {
  const isInternalLink = isInternalItem(item);

  const isActive = 'isActive' in item && item.isActive;

  const isHighlighted = checkRouteHighlight(item);
  const href = isInternalLink ? route(item.nextRoute) : item.url;

  const handlePreload = React.useCallback(() => {
    if (isInternalLink) {
      preloadRoute(href);
    }
  }, [ href, isInternalLink ]);

  return (
    <chakra.li
      listStyleType="none"
    >
      <Link
        className={ className }
        href={ href }
        external={ !isInternalLink }
        onFocus={ handlePreload }
        onPointerEnter={ handlePreload }
        display="flex"
        alignItems="center"
        variant="navigation"
        { ...(isActive ? { 'data-selected': true } : {}) }
        w="224px"
        px={ 2 }
        py="9px"
        textStyle="sm"
        fontWeight={ 500 }
        borderRadius="base"
      >
        { !noIcon && <NavLinkIcon item={ item } mr={ 3 }/> }
        <chakra.span>{ item.text }</chakra.span>
        { isHighlighted && (
          <LightningLabel
            iconColor={ isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
            position={{ lg: 'static' }}
            ml={{ lg: '2px' }}
            isCollapsed={ false }
          />
        ) }
      </Link>
    </chakra.li>
  );
};

export default React.memo(chakra(NavLink));
