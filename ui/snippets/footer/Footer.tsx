import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { copy } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.UI.footer.frontendCommit }`;

const Footer = () => {

  const { data: backendVersionData } = useApiQuery('general:config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
      enabled: !config.features.multichain.isEnabled,
      refetchOnMount: false,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);

  // const BLOCKSCOUT_LINKS = [
  //   {
  //     icon: 'social/git' as const,
  //     iconSize: '20px',
  //     text: 'Contribute',
  //     url: 'https://github.com/blockscout/blockscout',
  //   },
  //   {
  //     icon: 'brands/pro_api' as const,
  //     iconSize: '20px',
  //     text: 'PRO API',
  //     url: 'https://dev.blockscout.com',
  //   },
  //   {
  //     icon: 'brands/autoscout' as const,
  //     iconSize: '20px',
  //     text: 'Autoscout',
  //     url: 'https://autoscout.blockscout.com',
  //   },
  //   {
  //     icon: 'docs' as const,
  //     iconSize: '20px',
  //     text: 'Docs',
  //     url: 'https://docs.blockscout.com',
  //   },
  //   {
  //     icon: 'social/twitter' as const,
  //     iconSize: '24px',
  //     text: 'X',
  //     url: 'https://x.com/blockscout',
  //   },
  //   {
  //     icon: 'social/discord' as const,
  //     iconSize: '24px',
  //     text: 'Discord',
  //     url: 'https://discord.gg/blockscout',
  //   },
  //   {
  //     icon: 'brands/blockscout' as const,
  //     iconSize: '20px',
  //     text: 'All chains',
  //     url: 'https://chains.blockscout.com',
  //   },
  // ].filter(Boolean);
  const BLOCKSCOUT_LINKS = [
    {
      icon: 'brands/autoscout' as const,
      iconSize: '20px',
      text: 'Official Website',
      url: 'https://www.futurecitizen.io/',
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '24px',
      text: 'X',
      url: 'https://x.com/fc_chain',
    },
    {
      icon: 'docs' as const,
      iconSize: '20px',
      text: 'Docs',
      url: 'https://docs.futurecitizen.io/',
    },
  ].filter(Boolean);

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return <Link href={ FRONT_VERSION_URL } external noIcon>{ config.UI.footer.frontendVersion }</Link>;
    }

    if (config.UI.footer.frontendCommit) {
      return <Link href={ FRONT_COMMIT_URL } external noIcon>{ config.UI.footer.frontendCommit }</Link>;
    }

    return null;
  })();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Flex
        alignItems="center"
        gridArea={ gridArea }
        flexWrap="wrap"
        justifyContent="flex-start"
        columnGap={ 3 }
        rowGap={ 2 }
        mb={{ base: 5, lg: 10 }}
        _empty={{ display: 'none' }}
      >
        <Flex alignItems="center" bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.1)" px={3} py={1.5} borderRadius="0">
          <Box w="6px" h="6px" bg="green.400" mr={2} boxShadow="0 0 5px rgba(72,187,120,0.8)" animation="pulseStatus 2s infinite" />
          <Text fontSize="xs" color="gray.400" fontFamily="'Space Mono', monospace" letterSpacing="0.1em">SYS_ONLINE</Text>
        </Flex>
        <style>{`
          @keyframes pulseStatus {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}</style>
        { /* !config.features.multichain.isEnabled && <NetworkAddToWallet source="Footer"/> */ }
      </Flex>
    );
  }, []);

  const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Box gridArea={ gridArea }>
        <Flex columnGap={ 3 } textStyle="xs" alignItems="center">
          <Link href="https://www.futurecitizen.io/" external noIcon display="inline-flex" alignItems="center" _hover={{ textDecoration: 'none' }}>
            <chakra.img
              src="/logo.jpg"
              alt="FC CHAIN Logo"
              w="12"
              h="12"
              mr="3"
              borderRadius="full"
              objectFit="cover"
            />
            <Text 
              fontSize="2xl" 
              fontWeight="900" 
              letterSpacing="0.2em" 
              color="white" 
              fontFamily="'Orbitron', 'Space Mono', 'Montserrat', monospace"
            >
              FC CHAIN
            </Text>
          </Link>
        </Flex>
        
        <Text mt={ 5 } fontSize="xs" color="gray.400" maxW="400px" lineHeight="1.8" letterSpacing="0.05em" fontFamily="'Space Mono', monospace">
          <Text as="span" color="gray.500">{'>'}</Text> SYS.INIT: CORE NODE ONLINE...<br/>
          <Text as="span" color="gray.500">{'>'}</Text> The Next Generation Explorer for FC Chain. Empowering future citizens with transparent, high-performance tracking infrastructure.
        </Text>
        <Box mt={ 6 } textStyle="xs" color="gray.500" borderTop="1px dashed rgba(255,255,255,0.1)" pt={4} fontFamily="'Space Mono', monospace">
          <Text>
            [LOG] Copyright { copy } FC Ecosystem 2023-{ (new Date()).getFullYear() }. All rights reserved.
          </Text>
        </Box>
      </Box>
    );
  }, [ apiVersionUrl, backendVersionData?.backend_version, frontendLink ]);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    position: 'relative',
    bg: { base: 'white', _dark: 'black' },
    overflow: 'hidden',
  };

  const contentProps: GridProps = {
    position: 'relative',
    zIndex: 1,
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 10 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  const renderRecaptcha = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.reCaptchaV2.siteKey) {
      return <Box gridArea={ gridArea }/>;
    }

    return (
      <Box gridArea={ gridArea } textStyle="xs" mt={ 6 } fontFamily="'Space Mono', monospace" color="gray.600">
        <span>Protected by reCAPTCHA & Google </span>
        <Link href="https://policies.google.com/privacy" external noIcon color="gray.500" _hover={{ color: 'white' }}>Privacy Policy</Link>
        <span> & </span>
        <Link href="https://policies.google.com/terms" external noIcon color="gray.500" _hover={{ color: 'white' }}>Terms</Link>
        <span>.</span>
      </Box>
    );
  };

  const LinksBlock = () => (
    <Box>
      <Flex alignItems="center" mb={ 6 }>
        <Box w="6px" h="6px" bg="gray.400" mr={3} />
        <Text fontWeight="700" color="gray.400" fontSize="sm" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" textTransform="uppercase">
          UPLINK CONNECTIONS
        </Text>
      </Flex>
      <VStack gap={ 3 } alignItems="start">
        <Link href="https://www.futurecitizen.io/" external noIcon _hover={{ color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }} px={2} py={2} w="100%" transition="all 0.2s" display="flex" alignItems="center" color="gray.400" border="1px solid transparent">
          <Flex w="6" h="6" mr={3} alignItems="center" justifyContent="center" bg="rgba(255,255,255,0.05)" color="gray.400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><path d="M12 2v20 M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </Flex>
          <Text fontWeight="400" fontSize="xs" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" transition="all 0.2s">NODE_HOME</Text>
        </Link>
        <Link href="https://x.com/fc_chain" external noIcon _hover={{ color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }} px={2} py={2} w="100%" transition="all 0.2s" display="flex" alignItems="center" color="gray.400" border="1px solid transparent">
          <Flex w="6" h="6" mr={3} alignItems="center" justifyContent="center" bg="rgba(255,255,255,0.05)" color="gray.400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </Flex>
          <Text fontWeight="400" fontSize="xs" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" transition="all 0.2s">X_NETWORK</Text>
        </Link>
        <Link href="https://docs.futurecitizen.io/" external noIcon _hover={{ color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }} px={2} py={2} w="100%" transition="all 0.2s" display="flex" alignItems="center" color="gray.400" border="1px solid transparent">
          <Flex w="6" h="6" mr={3} alignItems="center" justifyContent="center" bg="rgba(255,255,255,0.05)" color="gray.400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M10 6h6 M10 10h6 M10 14h2" /></svg>
          </Flex>
          <Text fontWeight="400" fontSize="xs" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" transition="all 0.2s">ARCHIVES_DOCS</Text>
        </Link>
      </VStack>
    </Box>
  );

  const DecorativeLines = () => (
    <>
      <Box position="absolute" top="0" left="0" width="100%" height="1px" bg="rgba(255,255,255,0.05)" zIndex={0}>
        <Box
          position="absolute"
          top="0"
          left="-20vw"
          width="20vw"
          height="1px"
          background="linear-gradient(90deg, transparent, rgba(229,193,88,0.5) 80%, #e5c158 100%)"
          boxShadow="0 0 10px 2px rgba(229,193,88,0.4)"
          animation="flowLightScan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite"
        />
      </Box>
      <Box position="absolute" bottom="0" right="0" width="300px" height="1px" bg="rgba(229,193,88,0.2)" zIndex={0} 
           boxShadow="0 0 15px rgba(229,193,88,0.1)" />
      <style>{`
        @keyframes flowLightScan {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { transform: translateX(120vw); opacity: 1; }
          100% { transform: translateX(120vw); opacity: 0; }
        }
      `}</style>
    </>
  );

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        <DecorativeLines />
        <Grid { ...contentProps }>
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
          </div>

          <Grid
            gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            <LinksBlock />

            {
              (linksData || []).slice(0, colNum - 1).map(linkGroup => (
                <Box key={ linkGroup.title }>
                  <Skeleton fontWeight={ 700 } fontSize="sm" color="gray.400" mb={ 4 } display="inline-block" fontFamily="'Space Mono', monospace" textTransform="uppercase" letterSpacing="0.1em" loading={ isPlaceholderData }>{ linkGroup.title }</Skeleton>
                  <VStack gap={ 1 } alignItems="start">
                    { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
                  </VStack>
                </Box>
              ))
            }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps }>
      <DecorativeLines />
      <Grid
        { ...contentProps }
        gridTemplateAreas={{
          lg: `
          "network links-top"
          "info links-bottom"
          "recaptcha links-bottom"
        `,
        }}
      >
        { renderNetworkInfo({ lg: 'network' }) }
        { renderProjectInfo({ lg: 'info' }) }
        { renderRecaptcha({ lg: 'recaptcha' }) }

        <Flex
          gridArea={{ lg: 'links-bottom' }}
          direction="column"
          gap={ 5 }
          alignItems="flex-start"
          justifySelf={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          <LinksBlock />
        </Flex>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
