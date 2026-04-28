import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import type { IconName } from 'ui/shared/IconSvg';

export type Props = {
  className?: string;
  label: string;
  value: string | React.ReactNode;
  valuePrefix?: string;
  valuePostfix?: string;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
  period?: '1h' | '24h' | '30min';
  href?: Route;
  icon?: IconName;
  isFallback?: boolean;
  subtext?: React.ReactNode;
  subtextColor?: string;
};

const Container = ({ href, children, className }: { href?: Route; children: React.JSX.Element; className?: string }) => {
  if (href) {
    return (
      <Link href={ route(href) } variant="plain" className={ className } display="block" w="100%" h="100%">
        { children }
      </Link>
    );
  }

  return children;
};

const StatsWidget = ({
  className,
  label,
  value,
  valuePrefix,
  valuePostfix,
  isLoading,
  hint,
  diff,
  diffPeriod = '24h',
  diffFormatted,
  period,
  href,
  isFallback,
  subtext,
  subtextColor = '#64748b',
  ...rest
}: Props & { [key: string]: any }) => {
  return (
    <Box { ...rest } w="100%" h="100%">
      <Container href={ !isLoading ? href : undefined } className={ href ? className : undefined }>
        <Flex
          className={ href ? undefined : className }
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          bg="rgba(10, 10, 12, 0.8)" /* Extremely deep black/carbon per reference */
          border="1px solid rgba(255, 255, 255, 0.05)"
          py={ 6 }
          px={ 4 }
          position="relative"
          overflow="hidden"
          role="group"
          transition="colors 0.2s"
          _hover={{ borderColor: 'rgba(229, 193, 88, 0.3)', bg: 'rgba(15, 15, 18, 0.9)' }}
          w="100%"
          h="100%"
        >
        {/* Label */}
        <Box
          className="text-telemetry"
          fontSize="10px"
          color="#64748b" /* slate-500 */
          mb={ 2 }
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="0.1em"
          transition="colors 0.2s"
          _groupHover={{ color: 'rgba(229, 193, 88, 0.7)' }} /* red-500/70 */
          display="flex"
          alignItems="center"
          gap={1}
        >
          { label }
          { typeof hint === 'string' ? (
            <Hint label={ hint } boxSize={ 4 } color="inherit" _hover={{ color: '#22d3ee' }} />
          ) : hint }
        </Box>

        {/* Value */}
        <Box
          className="text-vanguard"
          fontSize="24px" /* text-2xl */
          color="white"
          fontWeight="bold"
          opacity={ isFallback && !isLoading ? 0.3 : 1 }
        >
          <Skeleton 
            loading={ isLoading } 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            minW="60px"
            minH="24px"
            borderRadius="md"
          >
            { valuePrefix && <chakra.span whiteSpace="pre">{ valuePrefix }</chakra.span> }
            { typeof value === 'string' ? (
              <TruncatedText text={ value } loading={ isLoading }/>
            ) : (
              value
            ) }
            { valuePostfix && <chakra.span whiteSpace="pre">{ valuePostfix }</chakra.span> }
          </Skeleton>
        </Box>

        {/* Diff / Period / Subtext */}
        { (diff || period || subtext) && (
          <Box
            fontSize="10px" /* very small subtext */
            color={ subtext ? (subtextColor || '#64748b') : 'rgba(229, 193, 88, 1)' }
            mt={ 2 }
            fontFamily="'Space Mono', monospace"
            letterSpacing="0.05em"
            textTransform="uppercase"
          >
            <Skeleton loading={ isLoading } display="flex" alignItems="center" justifyContent="center" gap={1}>
              { subtext && (
                <Text as="span">{ subtext }</Text>
              ) }
              { !subtext && diff && Number(diff) > 0 && (
                <>
                  <Text as="span">
                    +{ diffFormatted || Number(diff).toLocaleString() }
                  </Text>
                  <Text as="span" color="#64748b">({ diffPeriod })</Text>
                </>
              ) }
              { !subtext && period && <Text as="span" color="#64748b">({ period })</Text> }
            </Skeleton>
          </Box>
        ) }
      </Flex>
    </Container>
    </Box>
  );
};

export default chakra(StatsWidget);
