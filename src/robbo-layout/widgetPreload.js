/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */

// Header widgets («Что нового», notifications) start loading with the bundle, before frontend-platform has
// fetched the runtime config: the LMS is guessed from the MFE host (apps.<lms> on servers, the LMS host
// itself locally), the widget script is loaded and asked to prefetch its status. The mount later passes
// LMS_BASE_URL from the config; a wrong guess only means the widget asks again.
export const guessLmsBaseUrl = () => {
  if (process.env.NODE_ENV === 'test' || !/^https?:$/.test(window.location.protocol)) {
    return null;
  }
  return `${window.location.protocol}//${window.location.host.replace(/^apps\./, '')}`;
};

// The language getLocale() will pick: the language cookie, otherwise the browser's.
export const guessLang = () => {
  const cookie = document.cookie.split('; ').find((part) => part.startsWith('openedx-language-preference='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : window.navigator.language;
};

// One script per URL: a failed guess must not block the load from LMS_BASE_URL.
export const createWidgetLoader = (widgetPath, globalName) => {
  const promises = {};
  return (lmsBaseUrl) => {
    if (window[globalName]) {
      return Promise.resolve(window[globalName]);
    }
    const src = `${lmsBaseUrl.replace(/\/$/, '')}${widgetPath}`;
    if (!promises[src]) {
      promises[src] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => (window[globalName] ? resolve(window[globalName]) : reject(new Error('no widget')));
        script.onerror = () => {
          delete promises[src];
          reject(new Error(`${widgetPath} failed to load`));
        };
        document.head.appendChild(script);
      });
    }
    return promises[src];
  };
};

export const preloadWidget = (loadWidget) => {
  const lmsUrl = guessLmsBaseUrl();
  if (!lmsUrl) {
    return;
  }
  loadWidget(lmsUrl)
    .then((api) => api.prefetch && api.prefetch({ lmsUrl, lang: guessLang() }))
    .catch(() => {});
};
