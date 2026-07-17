import React from 'react';
import { createRoot } from 'react-dom/client';

import 'lib/setLocale';
import 'nextjs/global.css';

import './compat/init-env';
import { installNavigationEvents } from './compat/navigation-events';

interface AppModule {
  readonly App: React.ComponentType;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  })[char] || char);
}

function renderBootstrapError(rootElement: HTMLElement, error: unknown): void {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  const resources = performance.getEntriesByType('resource')
    .map((entry) => `${ entry.name } (${ Math.round(entry.duration) }ms)`)
    .join('\n');

  rootElement.innerHTML = [
    '<pre style="min-height:100vh;margin:0;padding:24px;color:#fecaca;background:#101112;white-space:pre-wrap;">',
    escapeHtml([ message, '', 'Loaded resources:', resources ].join('\n')),
    '</pre>',
  ].join('');
}

function loadApp(): Promise<AppModule> {
  return import('./App');
}

installNavigationEvents();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

void loadApp()
  .then(({ App }) => {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>,
    );
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    renderBootstrapError(rootElement, error);
  });
