import type { ButtonProps } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';

import UserIdenticon from '../UserIdenticon';

interface Props {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isPending?: boolean;
  isAutoConnectDisabled?: boolean;
  address?: string;
  domain?: string;
}

const UserWalletButton = ({ size, variant, isPending, isAutoConnectDisabled, address, domain, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {

  const isMobile = useIsMobile();

  const content = (() => {
    // 状态指示灯: 青色为已连接，暗青色微光为未连接
    const statusDot = (
      <Box
        w="8px" h="8px"
        borderRadius="0px"
        bg={ address ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)' }
        boxShadow={ address ? '0 0 10px #38bdf8' : '0 0 5px rgba(56, 189, 248, 0.2)' }
        mr={ 1 }
      />
    );

    if (!address) {
      return (
        <HStack gap={ 2 } alignItems="center">
          { statusDot }
          <Box>CONNECT WALLET</Box>
        </HStack>
      );
    }

    const text = domain || shortenString(address);

    return (
      <HStack gap={ 2 } alignItems="center">
        { statusDot }
        <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
        <Box display={{ base: 'none', md: 'block' }}>{ text }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      content="Connect your wallet to Meridian for full-featured access"
      disabled={ isMobile || Boolean(address) }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          size={ size }
          // 严格遵循工业级赛博深空风格
          background="linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.65) 100%)"
          backdropFilter="blur(24px)"
          border="1px solid rgba(56, 189, 248, 0.2)"
          borderTop="1px solid rgba(56, 189, 248, 0.4)"
          color={ address ? '#38bdf8' : 'whiteAlpha.900' }
          boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(56, 189, 248, 0.1)"
          _hover={{
            border: '1px solid rgba(56, 189, 248, 0.8)',
            boxShadow: '0 15px 40px -10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            background: 'linear-gradient(180deg, rgba(35, 48, 68, 0.75) 0%, rgba(18, 28, 50, 0.8) 100%)',
            transform: 'translateY(-2px)',
          }}
          _active={{
            transform: 'translateY(1px)',
            boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.15)',
          }}
          transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          px={{ base: 3, lg: 5 }}
          py={ 5 }
          fontWeight={ 700 }
          fontFamily="var(--font-inter)"
          letterSpacing="0.05em"
          textTransform="uppercase"
          fontSize="sm"
          borderRadius="0px"
          selected={ Boolean(address) }
          highlighted={ isAutoConnectDisabled }
          loading={ isPending }
          loadingText={ isMobile ? undefined : 'CONNECTING...' }
          { ...rest }
        >
          { content }
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
