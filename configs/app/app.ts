import { getEnvValue } from './utils';

function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return;
  }

  return document.cookie.split(`${ name }=`)[1]?.split(';')[0];
}

const appPort = getEnvValue('NEXT_PUBLIC_APP_PORT');
const appSchema = getEnvValue('NEXT_PUBLIC_APP_PROTOCOL');
const appHost = getEnvValue('NEXT_PUBLIC_APP_HOST');
const baseUrl = [
  appSchema || 'https',
  '://',
  appHost,
  appPort && ':' + appPort,
].filter(Boolean).join('');
const isDev = getEnvValue('NEXT_PUBLIC_APP_ENV') === 'development';
const isReview = getEnvValue('NEXT_PUBLIC_APP_ENV') === 'review';
const isPw = getEnvValue('NEXT_PUBLIC_APP_INSTANCE') === 'pw';
const spriteHash = getEnvValue('NEXT_PUBLIC_ICON_SPRITE_HASH');
const isPrivateMode = getCookieValue('app_profile') === 'private';
const proxyMode = getEnvValue('NEXT_PUBLIC_USE_NEXT_JS_PROXY');

const app = Object.freeze({
  isDev,
  isReview,
  isPw,
  protocol: appSchema || 'https',
  host: appHost,
  port: appPort,
  baseUrl,
  useProxy: proxyMode === 'true',
  disableProxy: proxyMode === 'false',
  spriteHash,
  isPrivateMode,
});

export default app;
