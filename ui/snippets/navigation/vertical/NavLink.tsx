import { HStack, Box, useBreakpointValue, chakra } from '@chakra-ui/react';
import React from 'react';
import type { NavItem } from 'types/client/navigation';
import { route } from 'nextjs-routes';
import useIsMobile from 'lib/hooks/useIsMobile';
import { isInternalItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

import LightningLabel, { LIGHTNING_LABEL_CLASS_NAME } from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';

type Props = {
  item: NavItem;
  onClick?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  isDisabled?: boolean;
  isSubItem?: boolean;
  index?: number;
};

const NavLink = ({ item, onClick, isCollapsed, isDisabled, isSubItem, index }: Props) => {
  const isMobile = useIsMobile();
  const isInternalLink = isInternalItem(item);
  const isXLScreen = useBreakpointValue({ base: false, xl: true });

  const isActive = isInternalLink && item.isActive;
  const isHighlighted = checkRouteHighlight(item);

  // FutureCitizen Authority Sidebar Style Match
  const activeBg = 'rgba(30, 41, 59, 0.5)'; // slate-800/50
  const hoverBg = 'rgba(15, 23, 42, 0.5)'; // slate-900/50
  const activeBorderColor = '#ee4949'; // red-500
  const borderColor = isActive ? activeBorderColor : 'transparent';
  
  const textColor = isActive ? '#ee4949' : '#94a3b8'; // Match left line color for text
  const hoverTextColor = '#e2e8f0'; // slate-200
  
  const iconColor = textColor; // Icon matches text color

  return (
    <Box as="li" listStyleType="none" w="100%" mb={ isSubItem ? 0 : 1 }>
      <Link
        href={ isInternalLink ? route(item.nextRoute as any) : item.url }
        external={ !isInternalLink }
        display="flex"
        position="relative"
        alignItems="center"
        w={ isCollapsed ? '60px' : '100%' }
        px="16px" // px-4
        py="10px" // py-2.5
        bg={ isActive ? activeBg : 'transparent' }
        borderLeft={ `2px solid ${borderColor}` }
        aria-label={ `${ item.text } link` }
        whiteSpace="normal"
        onClick={ onClick }
        _hover={{
          bg: isActive ? activeBg : hoverBg,
          '& .nav-text-span, & .nav-icon-wrapper': { color: isDisabled ? 'inherit' : hoverTextColor },
        }}
        textDecoration="none"
        pointerEvents={ isDisabled ? 'none' : 'auto' }
        transition="all 0.2s ease"
      >
        <Tooltip
          content={ item.text }
          showArrow={ false }
          disabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) || isSubItem }
          positioning={{ placement: 'right', offset: { crossAxis: 0, mainAxis: 20 } }}
          variant="popover"
          contentProps={{
            bg: 'rgba(2, 6, 23, 0.95)', // background matching app
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            fontFamily: "Inter, sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
          interactive
        >
          <HStack gap={ 0 } overflow="hidden" alignItems="center" w="100%">
            <Box className="nav-icon-wrapper" color={iconColor} display="flex" alignItems="center" justifyContent="center" transition="color 0.2s ease" flexShrink={0}>
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
