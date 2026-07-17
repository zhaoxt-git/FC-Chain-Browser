import { HStack, Box, useBreakpointValue, chakra } from '@chakra-ui/react';
import React from 'react';
import { preloadRoute } from 'src/compat/route-preload';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { isInternalItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';

type Props = {
  item: NavItem;
  onClick?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  isDisabled?: boolean;
  isSubItem?: boolean;
};

const NAV_PRELOAD_DELAY_MS = 120;

const NavLink = ({ item, onClick, isCollapsed, isDisabled, isSubItem }: Props) => {
  const isMobile = useIsMobile();
  const isInternalLink = isInternalItem(item);
  const isXLScreen = useBreakpointValue({ base: false, xl: true });
  const preloadTimeoutRef = React.useRef<number | undefined>(undefined);

  const isActive = isInternalLink && item.isActive;
  const isHighlighted = checkRouteHighlight(item);

  // FutureCitizen Authority Sidebar Style Match
  const activeBg = isSubItem ? 'transparent' : 'rgba(30, 41, 59, 0.5)'; // transparent for sub-items, slate-800/50 for top-level
  const hoverBg = isSubItem ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.5)'; // slight highlight for sub, slate-900/50 for top
  const activeBorderColor = '#e5c158'; // yellow
  const borderColor = isActive && !isSubItem ? activeBorderColor : 'transparent';

  const textColor = isActive ? '#e5c158' : '#94a3b8'; // yellow for both
  const hoverTextColor = '#e2e8f0'; // slate-200

  const iconColor = textColor; // Icon matches text color
  const href = isInternalLink ? route(item.nextRoute) : item.url;

  const handlePreload = React.useCallback(() => {
    if (isInternalLink) {
      preloadRoute(href);
    }
  }, [ href, isInternalLink ]);

  const clearScheduledPreload = React.useCallback(() => {
    if (preloadTimeoutRef.current !== undefined) {
      window.clearTimeout(preloadTimeoutRef.current);
      preloadTimeoutRef.current = undefined;
    }
  }, []);

  const schedulePreload = React.useCallback(() => {
    if (!isInternalLink) {
      return;
    }

    clearScheduledPreload();
    preloadTimeoutRef.current = window.setTimeout(() => {
      preloadTimeoutRef.current = undefined;
      handlePreload();
    }, NAV_PRELOAD_DELAY_MS);
  }, [ clearScheduledPreload, handlePreload, isInternalLink ]);

  React.useEffect(() => {
    return clearScheduledPreload;
  }, [ clearScheduledPreload ]);

  return (
    <Box as="li" listStyleType="none" w="100%" mb={ isSubItem ? 0 : 1 }>
      <Link
        href={ href }
        external={ !isInternalLink }
        display="flex"
        position="relative"
        alignItems="center"
        w={ isCollapsed ? '60px' : '100%' }
        px="16px" // px-4
        py="10px" // py-2.5
        bg={ isActive ? activeBg : 'transparent' }
        borderLeft={ `2px solid ${ borderColor }` }
        aria-label={ `${ item.text } link` }
        whiteSpace="normal"
        onClick={ onClick }
        onFocus={ handlePreload }
        onPointerEnter={ schedulePreload }
        onPointerLeave={ clearScheduledPreload }
        onPointerDown={ handlePreload }
        _hover={{
          bg: isActive ? activeBg : hoverBg,
          '& .nav-text-span, & .nav-icon-wrapper': { color: isDisabled ? 'inherit' : hoverTextColor },
        }}
        textDecoration="none"
        pointerEvents={ isDisabled ? 'none' : 'auto' }
        transition="background-color 160ms ease-out, border-color 160ms ease-out"
      >
        <Tooltip
          content={ item.text }
          showArrow={ false }
          openDelay={ 0 }
          disabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) || isSubItem }
          positioning={{ placement: 'right', offset: { crossAxis: 0, mainAxis: 20 } }}
          variant="popover"
          contentProps={{
            bg: 'rgba(2, 6, 23, 0.95)', // background matching app
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
          interactive
        >
          <HStack gap={ 0 } overflow="hidden" alignItems="center" w="100%">
            <Box
              className="nav-icon-wrapper"
              color={ iconColor }
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="color 0.2s ease"
              flexShrink={ 0 }
            >
              <NavLinkIcon item={ item }/>
            </Box>

            <chakra.span
              className="nav-text-span"
              color={ textColor }
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              letterSpacing="0.1em" // Authority OS tight tracking
              textTransform="uppercase"
              fontSize="12px" // text-xs
              fontWeight={ 700 } // font-bold
              lineHeight="1.3"
              transition="color 0.2s ease"
              display={ isCollapsed && !isSubItem ? 'none' : 'inline-block' }
              ml={ 4 }
            >
              { item.text }
            </chakra.span>

            { isHighlighted && (
              <LightningLabel
                iconColor={ isActive ? activeBorderColor : '#94a3b8' }
                isCollapsed={ isCollapsed }
              />
            ) }
          </HStack>
        </Tooltip>
      </Link>
    </Box>
  );
};

export default React.memo(NavLink);
