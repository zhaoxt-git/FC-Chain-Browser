import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

const SHOW_DELAY_MS = 120;

const RouteTransitionProgress = () => {
  const router = useRouter();
  const [ isVisible, setIsVisible ] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: number | undefined;

    const clearDelay = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const handleRouteChangeStart = (url: string) => {
      if (url === router.asPath) {
        return;
      }

      clearDelay();
      timeoutId = window.setTimeout(() => {
        timeoutId = undefined;
        setIsVisible(true);
      }, SHOW_DELAY_MS);
    };

    const handleRouteChangeEnd = () => {
      clearDelay();
      setIsVisible(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      clearDelay();
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [ router.asPath, router.events ]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={ 0 }
      left={ 0 }
      w="100%"
      h="2px"
      overflow="hidden"
      pointerEvents="none"
      zIndex="toast"
      css={{
        '@keyframes route-progress-slide': {
          from: { transform: 'translate3d(-100%, 0, 0)' },
          to: { transform: 'translate3d(300%, 0, 0)' },
        },
      }}
    >
      <Box
        h="100%"
        w="35%"
        bg="hover"
        animation="route-progress-slide 900ms ease-in-out infinite"
        willChange="transform"
      />
    </Box>
  );
};

export default React.memo(RouteTransitionProgress);
