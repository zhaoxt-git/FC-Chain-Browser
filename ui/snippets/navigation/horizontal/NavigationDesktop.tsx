import { Box, chakra, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import RewardsButton from 'ui/rewards/RewardsButton';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';
import UserProfileDesktop from 'ui/snippets/user/UserProfileDesktop';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const accountFeature = config.features.account;

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const isAuth = useIsAuth();

  const accountNavGroup = React.useMemo(() => {
    if (accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' && isAuth) {
      return {
        text: 'Account',
        subItems: accountNavItems,
      };
    }
  }, [ accountNavItems, isAuth ]);

  return (
    <Box 
      borderBottom="1px solid"
      borderColor={{ _light: 'rgba(229,193,88,0.1)', _dark: 'rgba(229,193,88,0.1)' }}
      bg={{ _light: '#05070a', _dark: '#05070a' }}
      boxShadow="0 4px 30px rgba(0,0,0,0.6)"
      position="relative"
      zIndex={100}
      color="white"
    >
      <Box position="absolute" top="0" left="0" width="100%" height="1px" pointerEvents="none" zIndex={2}>
        <Box
          position="absolute"
          top="0"
          left="-40vw"
          width="40vw"
          height="1px"
          background="linear-gradient(90deg, transparent, rgba(229,193,88,0.5) 40%, #ffffff 50%, rgba(229,193,88,0.5) 60%, transparent)"
          boxShadow="0 0 10px 1px rgba(229,193,88,0.5)"
          animation="flowLightReverseNav 6s infinite"
        />
      </Box>
      <style>{`
        @keyframes flowLightReverseNav {
          0% { transform: translateX(140vw); opacity: 0; }
          5% { opacity: 1; }
          45% { transform: translateX(-40vw); opacity: 1; }
          50% { transform: translateX(-40vw); opacity: 0; }
          100% { transform: translateX(-40vw); opacity: 0; }
        }
      `}</style>
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        alignItems="center"
        px={{ base: 6, xl: 10 }}
        py={ 4 }
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
        position="relative"
        zIndex={3}
      >
        <chakra.a href="/" display="flex" alignItems="center" _hover={{ textDecoration: 'none' }} mr={10}>
          <img src="/logo.jpg" alt="FC Chain Logo" style={{ height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(229,193,88,0.3)', boxShadow: '0 0 10px rgba(229,193,88,0.2)' }} />
          <chakra.span ml={4} fontWeight="800" fontSize="xl" letterSpacing="0.2em" textTransform="uppercase" color="#e5c158" textShadow="0 0 10px rgba(229,193,88,0.4)">FC Chain</chakra.span>
        </chakra.a>
        <TestnetBadge ml={ 3 }/>
        <RollupStageBadge ml={ 3 }/>
        <chakra.nav ml="auto" css={{ '& a, & span': { letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' } }}>
          <Flex as="ul" columnGap={ 4 } alignItems="center">
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item }/>;
              } else {
                return <NavLink key={ item.text } item={ item } noIcon py={ 1.5 } w="fit-content"/>;
              }
            }) }
            { accountNavGroup && (
              <>
                <Separator orientation="vertical" mx={ 0 } h={ 4 }/>
                <NavLinkGroup key={ accountNavGroup.text } item={ accountNavGroup }/>
              </>
            ) }
          </Flex>
        </chakra.nav>
        <Flex gap={ 2 } ml={ 8 } _empty={{ display: 'none' }}>
          <NavigationPromoBanner/>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          <UserProfileDesktop buttonSize="sm"/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
