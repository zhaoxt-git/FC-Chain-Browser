import React from 'react';

import useIsMounted from 'lib/hooks/useIsMounted';

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
}

let hasMountedOnce = false;

const Root = ({ children, content }: Props) => {
  const [ wasMountedBefore ] = React.useState(hasMountedOnce);
  const isMounted = useIsMounted();

  React.useEffect(() => {
    hasMountedOnce = true;
  }, []);

  if (!isMounted && !wasMountedBefore) {
    return content;
  }

  return children;
};

export default React.memo(Root);
