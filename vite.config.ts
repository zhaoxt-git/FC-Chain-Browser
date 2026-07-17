import react from '@vitejs/plugin-react';
import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';
import path from 'node:path';
import { defineConfig, loadEnv, type Plugin, type PreviewServer, type ViteDevServer } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

interface VitePublicEnv {
  readonly NEXT_PUBLIC_API_PROTOCOL?: string;
  readonly NEXT_PUBLIC_API_HOST?: string;
  readonly NEXT_PUBLIC_API_PORT?: string;
}

function getApiEndpoint(env: VitePublicEnv): string {
  if (!env.NEXT_PUBLIC_API_HOST) {
    return 'https://eth.blockscout.com';
  }

  return [
    env.NEXT_PUBLIC_API_PROTOCOL || 'https',
    '://',
    env.NEXT_PUBLIC_API_HOST,
    env.NEXT_PUBLIC_API_PORT ? `:${ env.NEXT_PUBLIC_API_PORT }` : '',
  ].join('');
}

function getHeaderValue(headers: IncomingHttpHeaders, name: string): string | undefined {
  const value = headers[name];

  return Array.isArray(value) ? value[0] : value;
}

function readRequestBody(req: IncomingMessage): Promise<ArrayBuffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve, reject) => {
    const chunks: Array<Uint8Array> = [];

    req.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? new Uint8Array(chunk) : new TextEncoder().encode(chunk));
    });
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve(undefined);
        return;
      }

      const body = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0));
      let offset = 0;

      chunks.forEach((chunk) => {
        body.set(chunk, offset);
        offset += chunk.byteLength;
      });

      resolve(body.buffer);
    });
    req.on('error', reject);
  });
}

function getForwardHeaders(headers: IncomingHttpHeaders): Headers {
  const result = new Headers();

  Object.entries(headers).forEach(([ key, value ]) => {
    if (
      !value ||
      [
        'host',
        'connection',
        'cookie',
        'origin',
        'referer',
        'x-endpoint',
        'sec-fetch-dest',
        'sec-fetch-mode',
        'sec-fetch-site',
        'accept-encoding',
        'content-length',
      ].includes(key.toLowerCase())
    ) {
      return;
    }

    result.set(key, Array.isArray(value) ? value.join(',') : value);
  });

  return result;
}

async function getStatsFallback(pathname: string): Promise<unknown | undefined> {
  if (pathname === '/api/v1/lines') {
    const { base } = await import('./mocks/stats/lines');
    return base;
  }

  if (pathname === '/api/v1/counters') {
    const { base } = await import('./mocks/stats/main');

    return Object.values(base).filter((item) => 'id' in item && 'value' in item);
  }

  const lineMatch = /^\/api\/v1\/lines\/([^/]+)$/.exec(pathname);

  if (lineMatch) {
    const { averageGasPrice } = await import('./mocks/stats/line');

    return {
      ...averageGasPrice,
      info: {
        ...averageGasPrice.info,
        id: decodeURIComponent(lineMatch[1] || averageGasPrice.info.id),
      },
    };
  }
}

function blockscoutApiProxy(defaultEndpoint: string): Plugin {
  const installMiddleware = (server: PreviewServer | ViteDevServer) => {
    server.middlewares.use('/node-api/proxy', async(req, res) => {
      const endpoint = getHeaderValue(req.headers, 'x-endpoint') || defaultEndpoint;
      const originalUrl = req.originalUrl ?? req.url ?? '';
      const pathWithQuery = originalUrl.replace(/^\/node-api\/proxy/, '');
      const targetUrl = new URL(pathWithQuery, endpoint);

      try {
        const response = await fetch(targetUrl, {
          method: req.method,
          headers: getForwardHeaders(req.headers),
          body: await readRequestBody(req),
        });

        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          if (![ 'content-encoding', 'content-length', 'transfer-encoding' ].includes(key.toLowerCase())) {
            res.setHeader(key, value);
          }
        });

        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (error) {
        server.config.logger.error(`[blockscout-api-proxy] Request failed: ${ targetUrl.toString() }`);
        server.config.logger.error(error instanceof Error ? error.stack || error.message : String(error));

        const fallback = await getStatsFallback(targetUrl.pathname);

        if (fallback) {
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(fallback));
          return;
        }

        res.statusCode = 502;
        res.setHeader('content-type', 'text/plain');
        res.end(error instanceof Error ? error.message : 'Proxy request failed');
      }
    });
  };

  return {
    name: 'blockscout-api-proxy',
    configureServer(server) {
      installMiddleware(server);
    },
    configurePreviewServer(server) {
      installMiddleware(server);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), [ 'VITE_', 'NEXT_PUBLIC_' ]);

  return {
    base: './',
    envPrefix: [ 'VITE_', 'NEXT_PUBLIC_' ],
    plugins: [
      blockscoutApiProxy(getApiEndpoint(env)),
      svgr({ exportAsDefault: true }),
      react(),
      tsconfigPaths(),
    ],
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
    resolve: {
      alias: {
        'next/router': path.resolve(__dirname, 'src/compat/next-router.ts'),
        'next/link': path.resolve(__dirname, 'src/compat/next-link.tsx'),
        'next/dynamic': path.resolve(__dirname, 'src/compat/next-dynamic.tsx'),
        'next/head': path.resolve(__dirname, 'src/compat/next-head.tsx'),
        'next/script': path.resolve(__dirname, 'src/compat/next-script.tsx'),
        'next/image': path.resolve(__dirname, 'src/compat/next-image.tsx'),
      },
    },
    server: {
      port: 5173,
    },
  };
});
