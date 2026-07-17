import React from 'react';

export default function Head({ children }: { readonly children?: React.ReactNode }): React.ReactElement {
  return React.createElement(React.Fragment, null, children);
}
