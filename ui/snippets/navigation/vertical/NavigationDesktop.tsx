import { Flex, Box, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import IconSvg from 'ui/shared/IconSvg';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkIcon from 'ui/snippets/networkLogo/NetworkIcon';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';
import NavLinkRewards from './NavLinkRewards';

const NavigationDesktop = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  let isNavBarCollapsed;
  if (isNavBarCollapsedCookie === 'true') {
    isNavBarCollapsed = true;
  }
  if (isNavBarCollapsedCookie === 'false') {
    isNavBarCollapsed = false;
  }

  const { mainNavItems, accountNavItems } = useNavItems();

  const isAuth = useIsAuth();

  const [ isCollapsedState, setCollapsedState ] = React.useState<boolean | undefined>(isNavBarCollapsed ?? true);
  const isCollapsed = isCollapsedState === true;

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((val) => {
      const newState = !val;
      cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, String(newState), { path: '/' });
      return newState;
    });
  }, []);

  const handleContainerClick = React.useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleTogglerClick();
    }
  }, [ handleTogglerClick ]);

  const isExpanded = !isCollapsed;

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      className="group"
      position="sticky"
      top={ 0 }
      height="100vh"
      overflowY="visible"
      overflowX="visible"
      flexDirection="column"
      alignItems="stretch"
      flexShrink={ 0 }
      borderRight="1px solid rgba(255, 255, 255, 0.15) !important"
      px={ isCollapsed ? 4 : 6 }
      pt={ 12 }
      pb={ 6 }
      width={ isCollapsed ? '92px' : '260px' }
      minWidth={ isCollapsed ? '92px' : '260px' }
      onClick={ handleContainerClick }
      transitionProperty="width, padding"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    >
      <TestnetBadge position="absolute" pl={ 3 } w="49px" top="34px"/>
      <RollupStageBadge position="absolute" ml={ isCollapsed ? '10px' : 3 } top="34px"/>
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        pl={ isCollapsed ? '15px' : 3 }
        pr={ isCollapsed ? '15px' : 0 }
        h={ 10 }
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
        <Box display={{ base: 'none', lg: isCollapsed ? 'none' : 'block' }}>
          <NextLink href="/" style={{ textDecoration: 'none', cursor: 'pointer', display: 'block' }}>
            <Flex alignItems="center">
              <img src="/logo.jpg" alt="FC Chain Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'transparent' }} />
              <Box ml={4} display="flex" flexDirection="column" justifyContent="center">
                <Box fontWeight="800" fontSize="16px" letterSpacing="0.15em" textTransform="uppercase" color="white" lineHeight="1" fontFamily="'Inter', sans-serif">FC CHAIN</Box>
              </Box>
            </Flex>
          </NextLink>
        </Box>
        <Box display={{ base: 'none', lg: isCollapsed ? 'block' : 'none' }}>
          <NextLink href="/" style={{ textDecoration: 'none', cursor: 'pointer', display: 'block' }}>
            <img src="/logo.jpg" alt="FC Chain Icon" style={{ height: '32px', width: '32px', objectFit: 'contain', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
          </NextLink>
        </Box>
      </Box>
      <Box mt={6} borderBottom="1px solid rgba(255,255,255,0.05)" />
      <Box flex="1" overflowY="auto" overflowX="hidden" w="100%" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
        <Box as="nav" mt={ 4 } w="100%">
        <VStack as="ul" gap="1" alignItems="flex-start">
          { mainNavItems.map((item, index) => {
            if (isGroupItem(item)) {
              return <NavLinkGroup key={ item.text } item={ item } isCollapsed={ isCollapsed } index={index} />;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed } index={index} />;
            }
          }) }
        </VStack>
      </Box>
    { isAuth && (
        <Box as="nav" borderTopWidth="1px" borderColor="border.divider" w="100%" mt={ 3 } pt={ 3 }>
          <VStack as="ul" gap="1" alignItems="flex-start">
            <NavLinkRewards
              isCollapsed={ isCollapsed }
            />
            { accountNavItems.map((item) => (
              <NavLink
                key={ item.text }
                item={ item }
                isCollapsed={ isCollapsed }
              />
            )) }
          </VStack>
        </Box>
      ) }
        <NavigationPromoBanner isCollapsed={ isCollapsed }/>
      </Box>
      <IconSvg
        name="arrows/east-mini"
        width={ 6 }
        height={ 6 }
        _hover={{ color: 'hover' }}
        borderRadius="base"
        bgColor="bg.primary"
        color={{ base: 'blackAlpha.400', _dark: 'whiteAlpha.400' }}
        borderWidth="1px"
        borderColor="border.divider"
        transform={ isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }
        transformOrigin="center"
        position="absolute"
        top="104px"
        left={ isCollapsed ? '80px' : '248px' }
        zIndex={ 20 }
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
        display="none"
        _groupHover={{ display: 'block' }}
        transitionProperty="transform, left"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      />
    </Flex>
  );
};

export default NavigationDesktop;
