import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  getConfig,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React, { StrictMode } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';

import messages from './i18n';
import configureStore from './data/configureStore';
import { RobboFooter, RobboHeader } from './robbo-layout';

import './index.scss';
import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

const initYandexMetrika = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  const cfg = getConfig();
  if (!cfg.ENABLE_YANDEX_METRIKA || cfg.YANDEX_METRIKA_COUNTER_ID == null || cfg.YANDEX_METRIKA_COUNTER_ID === '') {
    return;
  }
  const counterId = Number(cfg.YANDEX_METRIKA_COUNTER_ID);
  if (!Number.isFinite(counterId) || counterId <= 0) {
    return;
  }
  const src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
  const alreadyLoaded = Array.from(document.scripts || []).some(
    (scriptEl) => scriptEl.src === src || scriptEl.src.indexOf('https://mc.yandex.ru/metrika/tag.js') === 0,
  );
  if (!alreadyLoaded) {
    const scriptEl = document.createElement('script');
    scriptEl.async = true;
    scriptEl.src = src;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(scriptEl, firstScript);
    } else {
      document.head.appendChild(scriptEl);
    }
  }
  window.ym = window.ym || function ymShim() { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = 1 * new Date();
  window.ym(counterId, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
};

const rootNode = createRoot(document.getElementById('root'));
subscribe(APP_READY, () => {
  initYandexMetrika();
  rootNode.render(
    <StrictMode>
      <AppProvider store={configureStore()}>
        <Head />
        <RobboHeader />
        <main id="main">
          <AppRoutes />
        </main>
        <RobboFooter />
      </AppProvider>
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  rootNode.render(<ErrorPage message={error.message} />);
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
        // Align with LMS (`openedx-language-preference`); empty env would skip cookie-based locale.
        LANGUAGE_PREFERENCE_COOKIE_NAME: process.env.LANGUAGE_PREFERENCE_COOKIE_NAME || 'openedx-language-preference',
      }, 'App loadConfig override handler');
    },
  },
});
