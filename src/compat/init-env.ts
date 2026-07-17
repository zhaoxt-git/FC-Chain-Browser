const viteEnvs = Object.fromEntries(
  Object.entries(import.meta.env).map(([ key, value ]) => [ key, String(value) ]),
);

const envs = {
  ...window.__envs,
  ...viteEnvs,
  NEXT_PUBLIC_APP_PROTOCOL: window.location.protocol.replace(':', ''),
  NEXT_PUBLIC_APP_HOST: window.location.hostname,
  NEXT_PUBLIC_APP_PORT: window.location.port,
  NEXT_PUBLIC_API_PORT: Object.hasOwn(viteEnvs, 'NEXT_PUBLIC_API_PORT') ? viteEnvs.NEXT_PUBLIC_API_PORT : window.__envs.NEXT_PUBLIC_API_PORT ?? '',
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
};

window.__envs = envs;
window.process = window.process || { env: envs };
window.process.env = envs;
