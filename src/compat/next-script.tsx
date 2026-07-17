import React from 'react';

export default function Script(props: React.ScriptHTMLAttributes<HTMLScriptElement>): React.ReactElement {
  return <script { ...props }/>;
}
