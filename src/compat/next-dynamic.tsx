import React from 'react';

interface DynamicOptions {
  readonly loading?: React.ComponentType;
  readonly ssr?: boolean;
}

type DynamicModule<TProps extends object> = {
  readonly 'default': React.ComponentType<TProps>;
};

type DynamicLoaderResult<TProps extends object> = DynamicModule<TProps> | React.ComponentType<TProps>;

function isDynamicModule<TProps extends object>(value: DynamicLoaderResult<TProps>): value is DynamicModule<TProps> {
  return typeof value === 'object' && value !== null && 'default' in value;
}

async function normalizeLoaderResult<TProps extends object>(
  loader: () => Promise<DynamicLoaderResult<TProps>>,
): Promise<DynamicModule<TProps>> {
  const result = await loader();

  return isDynamicModule(result) ? result : { 'default': result };
}

export default function dynamic<TProps extends object>(
  loader: () => Promise<DynamicLoaderResult<TProps>>,
  options?: DynamicOptions,
): React.ComponentType<TProps> {
  void options;

  const Component = React.lazy(() => normalizeLoaderResult(loader));

  return function DynamicComponent(props: TProps): React.JSX.Element {
    const Loading = options?.loading;

    return (
      <React.Suspense fallback={ Loading ? <Loading/> : null }>
        <Component { ...props }/>
      </React.Suspense>
    );
  };
}
