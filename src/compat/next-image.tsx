import React from 'react';

export default function Image(props: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement {
  return <img { ...props }/>;
}
