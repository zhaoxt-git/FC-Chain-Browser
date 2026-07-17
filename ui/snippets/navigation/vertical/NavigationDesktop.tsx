import { Flex, Box, VStack, chakra } from '@chakra-ui/react';
import React from 'react';

import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';
import useIsAuth from 'ui/snippets/auth/useIsAuth';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';
import NavLinkRewards from './NavLinkRewards';

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const isAuth = useIsAuth();

  const [ isCollapsedState, setCollapsedState ] = React.useState(false);
  const [ openGroupsCount, setOpenGroupsCount ] = React.useState(0);
  const isCollapsed = isCollapsedState === true;
  const hasOpenGroup = openGroupsCount > 0;

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((val) => {
      return !val;
    });
  }, []);

  const handleContainerClick = React.useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleTogglerClick();
    }
  }, [ handleTogglerClick ]);

  const handleGroupOpenChange = React.useCallback((isOpen: boolean) => {
    setOpenGroupsCount((value) => Math.max(0, value + (isOpen ? 1 : -1)));
  }, []);

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      className="group"
      position="sticky"
      top={ 0 }
      zIndex="popover"
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
          <Link href="/" textDecoration="none" cursor="pointer" display="block">
            <Flex alignItems="center">
              <chakra.img
                src="/logo.jpg"
                alt="Meridian Logo"
                h="36px"
                w="36px"
                objectFit="contain"
                border="1px solid rgba(255, 255, 255, 0.1)"
                background="transparent"
              />
              <Box ml={ 4 } display="flex" flexDirection="column" justifyContent="center">
                <Box
                  fontWeight="800"
                  fontSize="16px"
                  letterSpacing="0.15em"
                  textTransform="uppercase"
                  color="white"
                  lineHeight="1"
                  fontFamily="'Inter', sans-serif"
                >
                  Meridian
                </Box>
              </Box>
            </Flex>
          </Link>
        </Box>
        <Box display={{ base: 'none', lg: isCollapsed ? 'block' : 'none' }}>
          <Link href="/" textDecoration="none" cursor="pointer" display="block">
            <chakra.img
              src="/logo.jpg"
              alt="Meridian Icon"
              h="32px"
              w="32px"
              objectFit="contain"
              border="1px solid rgba(255, 255, 255, 0.1)"
            />
          </Link>
        </Box>
      </Box>
      <Box mt={ 6 } borderBottom="1px solid rgba(255,255,255,0.05)"/>
      <Box flex="1" overflow="visible" w="100%" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
        <Box as="nav" mt={ 4 } w="100%">
          <VStack as="ul" gap="1" alignItems="flex-start">
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return (
                  <NavLinkGroup
                    key={ item.text }
                    item={ item }
                    isCollapsed={ isCollapsed }
                    onOpenChange={ handleGroupOpenChange }
                  />
                );
              } else {
                return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
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
        className="sidebar-collapse-toggle"
        name="arrows/east-mini"
        boxSize={ 7 }
        p="5px"
        _hover={{
          color: '#ffffff',
          bg: 'rgba(30, 41, 59, 0.95)',
          borderColor: 'rgba(229, 193, 88, 0.75)',
          scale: '1.08',
          boxShadow: '0 0 0 1px rgba(229, 193, 88, 0.25), 0 10px 22px rgba(0,0,0,0.45)',
        }}
        borderRadius="sm"
        bg="rgba(16, 17, 18, 0.95)"
        color="#e5c158"
        border="1px solid rgba(229, 193, 88, 0.35)"
        boxShadow="0 0 0 1px rgba(0,0,0,0.35), 0 8px 18px rgba(0,0,0,0.35)"
        rotate={ isCollapsed ? '180deg' : '0deg' }
        scale="0.94"
        transformOrigin="center"
        position="absolute"
        top="104px"
        left={ isCollapsed ? '78px' : '246px' }
        zIndex={ 20 }
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
        opacity={ 0 }
        pointerEvents="none"
        _groupHover={{
          opacity: hasOpenGroup ? 0 : 1,
          pointerEvents: hasOpenGroup ? 'none' : 'auto',
          scale: '1',
        }}
        transitionProperty="opacity, scale, rotate, left, background-color, border-color, color, box-shadow"
        transitionDuration="fast"
        transitionTimingFunction="ease-out"
      />
    </Flex>
  );
};

export default NavigationDesktop;
