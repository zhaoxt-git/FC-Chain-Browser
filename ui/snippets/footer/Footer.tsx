import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { copy } from 'toolkit/utils/htmlEntities';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';

import FooterLinkItem from './FooterLinkItem';
const MAX_LINKS_COLUMNS = 4;
// const DECORATIVE_DIVIDER_HEIGHT = '128px';

const Footer = () => {
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
        <Flex
          alignItems="center"
          bg="rgba(255,255,255,0.03)"
          border="1px solid rgba(255,255,255,0.1)"
          px={ 3 }
          py={ 1.5 }
          borderRadius="0"
        >
          <Box
            w="6px"
            h="6px"
            bg="green.400"
            mr={ 2 }
            boxShadow="0 0 5px rgba(72,187,120,0.8)"
            animation="pulseStatus 2s infinite"
          />
          <Text fontSize="xs" color="gray.400" fontFamily="'Space Mono', monospace" letterSpacing="0.1em">SYS_ONLINE</Text>
        </Flex>
        <style>{ `
          @keyframes pulseStatus {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        ` }</style>
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

        <Text
          mt={ 5 }
          fontSize="xs"
          color="gray.400"
          maxW="400px"
          lineHeight="1.8"
          letterSpacing="0.05em"
          fontFamily="'Space Mono', monospace"
        >
          <Text as="span" color="gray.500">{ '>' }</Text> SYS.INIT: CORE NODE ONLINE...<br/>
          <Text as="span" color="gray.500">{ '>' }</Text> The Next Generation Explorer for FC Chain.
          Empowering future citizens with transparent, high-performance tracking infrastructure.
        </Text>
        <Box mt={ 6 } textStyle="xs" color="gray.500" borderTop="1px dashed rgba(255,255,255,0.1)" pt={ 4 } fontFamily="'Space Mono', monospace">
          <Text>
            [LOG] Copyright { copy } FC Ecosystem 2023-{ (new Date()).getFullYear() }. All rights reserved.
          </Text>
        </Box>
      </Box>
    );
  }, []);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    position: 'relative',
    backgroundColor: 'black',
    overflow: 'hidden',
    isolation: 'isolate',
  };

  const contentProps: GridProps = {
    position: 'relative',
    zIndex: 2,
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    pt: { base: 20, lg: 28 },
    pb: { base: 4, lg: 10 },
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

  const linkHoverProps = {
    color: 'white',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  const linkBaseProps = {
    external: true,
    noIcon: true,
    px: 2,
    py: 2,
    w: '100%',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    color: 'gray.400',
    border: '1px solid transparent',
    _hover: linkHoverProps,
  };

  const LinksBlock = () => (
    <Box>
      <Flex alignItems="center" mb={ 6 }>
        <Box w="6px" h="6px" bg="gray.400" mr={ 3 }/>
        <Text fontWeight="700" color="gray.400" fontSize="sm" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" textTransform="uppercase">
          UPLINK CONNECTIONS
        </Text>
      </Flex>
      <VStack gap={ 3 } alignItems="start">
        <Link href="https://www.futurecitizen.io/" { ...linkBaseProps }>
          <Flex w="6" h="6" mr={ 3 } alignItems="center" justifyContent="center" bg="rgba(255,255,255,0.05)" color="gray.400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2v20 M2 12h20"/>
              <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>
            </svg>
          </Flex>
          <Text fontWeight="400" fontSize="xs" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" transition="all 0.2s">NODE_HOME</Text>
        </Link>
        <Link href="https://x.com/fc_chain" { ...linkBaseProps }>
          <Flex w="6" h="6" mr={ 3 } alignItems="center" justifyContent="center" bg="rgba(255,255,255,0.05)" color="gray.400">
            <Text fontSize="12px" lineHeight="1" fontWeight="700">X</Text>
          </Flex>
          <Text fontWeight="400" fontSize="xs" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" transition="all 0.2s">X_NETWORK</Text>
        </Link>
        <Link href="https://docs.futurecitizen.io/" { ...linkBaseProps }>
          <Flex w="6" h="6" mr={ 3 } alignItems="center" justifyContent="center" bg="rgba(255,255,255,0.05)" color="gray.400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3h12v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
              <path d="M9 7h6 M9 11h6 M9 15h3"/>
            </svg>
          </Flex>
          <Text fontWeight="400" fontSize="xs" letterSpacing="0.1em" fontFamily="'Space Mono', monospace" transition="all 0.2s">ARCHIVES_DOCS</Text>
        </Link>
      </VStack>
    </Box>
  );

  /*
  const DecorativeLines = () => (
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height={ DECORATIVE_DIVIDER_HEIGHT }
      backgroundColor="black"
      zIndex={ 1 }
      pointerEvents="none"
    >
      <Box
        position="absolute"
        top="50%"
        left="0"
        width="100%"
        height="1px"
        backgroundColor="rgba(255,255,255,0.08)"
      />
      <Box
        position="absolute"
        top="50%"
        left={{ base: '21%', lg: '28%' }}
        width={{ base: '58%', md: '50%', lg: '44%' }}
        height="1px"
        background={ [
          'linear-gradient(90deg, transparent 0%, rgba(31,107,151,0.1) 18%,',
          'rgba(23,117,194,0.38) 64%, rgba(40,82,255,0.66) 100%)',
        ].join(' ') }
        boxShadow="0 0 14px 1px rgba(36,118,255,0.24)"
      />
      <Box
        position="absolute"
        top="calc(50% - 18px)"
        left={{ base: '21%', lg: '28%' }}
        width={{ base: '58%', md: '50%', lg: '44%' }}
        height="36px"
        background="linear-gradient(180deg, transparent 0%, rgba(36,118,255,0.1) 50%, transparent 100%)"
        filter="blur(14px)"
        opacity={ 0.7 }
      />
    </Box>
  );
  */

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        { /* <DecorativeLines/> */ }
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
            <LinksBlock/>

            {
              (linksData || []).slice(0, colNum - 1).map(linkGroup => (
                <Box key={ linkGroup.title }>
                  <Skeleton
                    fontWeight={ 700 }
                    fontSize="sm"
                    color="gray.400"
                    mb={ 4 }
                    display="inline-block"
                    fontFamily="'Space Mono', monospace"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    loading={ isPlaceholderData }
                  >
                    { linkGroup.title }
                  </Skeleton>
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
      { /* <DecorativeLines/> */ }
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
          <LinksBlock/>
        </Flex>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
