import { Text, HStack, Box, VStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';

type Props = {
  item: NavGroupItem;
  isCollapsed?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

const NavLinkGroup = ({ item, isCollapsed, onOpenChange }: Props) => {
  const router = useRouter();
  const rootRef = React.useRef<HTMLLIElement | null>(null);
  const previousIsOpenRef = React.useRef(false);
  const [ isOpen, setIsOpen ] = React.useState(false);
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

  const closePanel = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const openPanel = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLLIElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (!nextFocusedElement || !rootRef.current?.contains(nextFocusedElement)) {
      closePanel();
    }
  }, [ closePanel ]);

  React.useEffect(() => {
    router.events.on('routeChangeStart', closePanel);

    return () => {
      router.events.off('routeChangeStart', closePanel);
    };
  }, [ closePanel, router.events ]);

  React.useEffect(() => {
    if (previousIsOpenRef.current !== isOpen) {
      previousIsOpenRef.current = isOpen;
      onOpenChange?.(isOpen);
    }
  }, [ isOpen, onOpenChange ]);

  React.useEffect(() => {
    return () => {
      if (previousIsOpenRef.current) {
        onOpenChange?.(false);
      }
    };
  }, [ onOpenChange ]);

  const content = (
    <Box
      width="228px"
      bg="rgba(16, 17, 18, 0.98)"
      p={ 3 }
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="md"
      boxShadow="0 18px 40px rgba(0,0,0,0.55)"
    >
      <Text
        color="#FFFFFF"
        fontFamily="Inter, sans-serif"
        letterSpacing="0.1em"
        textTransform="uppercase"
        fontSize="0.75rem"
        mb={ 3 }
        display={ isCollapsed ? 'block' : 'none' }
      >
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
            { subItem.map(subSubItem => (
              <NavLink key={ subSubItem.text } item={ subSubItem } isCollapsed={ false } isSubItem={ true } onClick={ closePanel }/>
            )) }
          </Box>
        ) :
          <NavLink key={ subItem.text } item={ subItem } isCollapsed={ false } isSubItem={ true } onClick={ closePanel }/>,
        ) }
      </VStack>
    </Box>
  );

  return (
    <Box
      ref={ rootRef }
      className="nav-link-group"
      as="li"
      data-open={ isOpen ? 'true' : undefined }
      listStyleType="none"
      w="100%"
      mb={ 1 }
      position="relative"
      zIndex={ 1 }
      _hover={{ zIndex: 20 }}
      _focusWithin={{ zIndex: 20 }}
      onPointerEnter={ openPanel }
      onPointerLeave={ closePanel }
      onFocus={ openPanel }
      onBlur={ handleBlur }
      css={{
        '&[data-open=true] > .nav-group-panel': {
          opacity: 1,
          pointerEvents: 'auto',
          transform: 'translate3d(0, 0, 0) scale(1)',
          visibility: 'visible',
        },
      }}
    >
      <Box
        w={ isCollapsed ? '60px' : '100%' }
        px="16px" // px-4
        py="10px" // py-2.5
        bg={ isActive ? activeBg : 'transparent' }
        borderLeft={ `2px solid ${ borderColor }` }
        display="flex"
        alignItems="center"
        aria-label={ `${ item.text } link group` }
        position="relative"
        cursor="pointer"
        tabIndex={ 0 }
        transition="background-color 160ms ease-out, border-color 160ms ease-out"
        _hover={{
          bg: isActive ? activeBg : hoverBg,
          '& .nav-text-span, & .nav-icon-wrapper, & .nav-arrow': { color: hoverTextColor },
        }}
      >
        <HStack gap={ 0 } overflow="hidden" alignItems="center" w="100%">
          <Box
            className="nav-icon-wrapper"
            color={ iconColor }
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="color 160ms ease-out"
            flexShrink={ 0 }
          >
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
            transition="color 160ms ease-out"
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
              color={ iconColor }
              opacity={ isCollapsed ? '0' : '1' }
              transform="rotate(180deg)"
              transitionProperty="opacity, transform, color"
              transitionDuration="normal"
              transitionTimingFunction="ease"
            />
          ) }
        </HStack>
      </Box>
      <Box
        className="nav-group-panel"
        position="absolute"
        left={ isCollapsed ? '68px' : 'calc(100% + 8px)' }
        top={ isCollapsed ? 0 : '-16px' }
        opacity={ 0 }
        pointerEvents="none"
        transform="translate3d(-6px, 0, 0) scale(0.995)"
        transformOrigin="left top"
        transitionDuration="80ms"
        transitionProperty="opacity, transform, visibility"
        transitionTimingFunction="ease-out"
        visibility="hidden"
        zIndex={ 30 }
      >
        { content }
      </Box>
    </Box>
  );
};

export default NavLinkGroup;
