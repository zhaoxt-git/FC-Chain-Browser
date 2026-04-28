import { Text, HStack, Box, VStack, chakra } from '@chakra-ui/react';
import React from 'react';
import type { NavGroupItem } from 'types/client/navigation';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';
import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';

type Props = {
  item: NavGroupItem;
  isCollapsed?: boolean;
  index?: number;
};

const NavLinkGroup = ({ item, isCollapsed, index }: Props) => {
  const isHighlighted = checkRouteHighlight(item.subItems);
  const isActive = item.isActive;

  // FutureCitizen Authority Sidebar Style Match
  const activeBg = 'rgba(30, 41, 59, 0.5)'; // slate-800/50
  const hoverBg = 'rgba(15, 23, 42, 0.5)'; // slate-900/50
  const activeBorderColor = '#e5c158'; // red-500
  const borderColor = isActive ? activeBorderColor : 'transparent';
  
  const textColor = isActive ? '#e5c158' : '#94a3b8'; // yellow : slate-400
  const hoverTextColor = '#e2e8f0'; // slate-200
  const iconColor = textColor;

  const content = (
    <Box width="228px" top={ isCollapsed ? 0 : '-16px' } bg="rgba(16, 17, 18, 0.95)" p={3} border="1px solid rgba(255,255,255,0.08)" borderRadius="md" backdropFilter="blur(10px)">
      <Text color="#FFFFFF" fontFamily="Inter, sans-serif" letterSpacing="0.1em" textTransform="uppercase" fontSize="0.75rem" mb={ 3 } display={ isCollapsed ? 'block' : 'none' }>
        { item.text }
      </Text>
      <VStack gap={ 1 } alignItems="start" as="ul" w="100%">
        { item.subItems.map((subItem, idx) => Array.isArray(subItem) ? (
          <Box
            key={ idx }
            w="100%"
            as="ul"
            _notLast={{
              mb: 2,
              pb: 2,
              borderBottomWidth: '1px',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            { subItem.map(subSubItem => <NavLink key={ subSubItem.text } item={ subSubItem } isCollapsed={ false } isSubItem={true} />) }
          </Box>
        ) :
          <NavLink key={ subItem.text } item={ subItem } isCollapsed={ false } isSubItem={true} />,
        ) }
      </VStack>
    </Box>
  );

  return (
    <Box as="li" listStyleType="none" w="100%" mb={ 1 }>
      <Tooltip
        content={ content }
        positioning={{ placement: 'right-start', offset: { crossAxis: 0, mainAxis: 8 } }}
        lazyMount={ false }
        variant="popover"
        openDelay={ 0 }
        interactive
        contentProps={{
          p: 0,
          bg: 'transparent',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <Box
          w={ isCollapsed ? '60px' : '100%' }
          px="16px" // px-4
          py="10px" // py-2.5
          bg={ isActive ? activeBg : 'transparent' }
          borderLeft={ `2px solid ${borderColor}` }
          display="flex"
          alignItems="center"
          aria-label={ `${ item.text } link group` }
          position="relative"
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            bg: isActive ? activeBg : hoverBg,
            '& .nav-text-span, & .nav-icon-wrapper, & .nav-arrow': { color: hoverTextColor },
          }}
        >
          <HStack gap={ 0 } overflow="hidden" alignItems="center" w="100%">
            <Box className="nav-icon-wrapper" color={iconColor} display="flex" alignItems="center" justifyContent="center" transition="color 0.2s ease" flexShrink={0}>
              <NavLinkIcon item={ item }/>
            </Box>

            <chakra.span
              className="nav-text-span"
              color={ textColor }
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              letterSpacing="0.1em"
              textTransform="uppercase"
              fontSize="0.75rem"
              fontWeight={ isActive ? 700 : 700 }
              transition="color 0.2s ease"
              display={ isCollapsed ? 'none' : 'inline-block' }
              whiteSpace="nowrap"
              ml={ 3 }
            >
              { item.text }
            </chakra.span>

            { isHighlighted && (
              <LightningLabel
                iconColor={ isActive ? activeBorderColor : '#94a3b8' }
                isCollapsed={ isCollapsed }
              />
            ) }

            { !isCollapsed && (
              <IconSvg
                name="arrows/east-mini"
                className="nav-arrow"
                position="absolute"
                right="7px"
                boxSize={ 5 }
                color={iconColor}
                opacity={ isCollapsed ? '0' : '1' }
                transform="rotate(180deg)"
                transitionProperty="opacity, transform, color"
                transitionDuration="normal"
                transitionTimingFunction="ease"
              />
            ) }
          </HStack>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default NavLinkGroup;
