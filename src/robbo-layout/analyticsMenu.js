/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { getConfig } from '@edx/frontend-platform';

const ABSOLUTE_URL = /^https?:\/\//i;

const buildUrl = (baseUrl, path) => {
  if (!baseUrl) {
    return null;
  }
  return `${baseUrl.replace(/\/$/, '')}${path}`;
};

export const normalizeRobboAnalyticsUrl = (url) => (
  url && ABSOLUTE_URL.test(url) ? url : null
);

export const getRobboAnalyticsUrl = (config = getConfig()) => (
  normalizeRobboAnalyticsUrl(config.ROBBO_ANALYTICS_URL)
  || normalizeRobboAnalyticsUrl(buildUrl(config.LMS_BASE_URL, '/robbo/analytics/'))
  || null
);

export const userCanAccessRobboAnalytics = (authenticatedUser) => {
  if (!authenticatedUser) {
    return false;
  }
  if (authenticatedUser.administrator || authenticatedUser.superuser) {
    return true;
  }
  return (authenticatedUser.roles || []).some((role) => {
    const roleName = role.split(':')[0];
    return roleName === 'instructor';
  });
};

export function useRobboAnalyticsMenu(authenticatedUser) {
  const config = getConfig();
  const fallbackUrl = getRobboAnalyticsUrl(config);
  const clientCanAccess = userCanAccessRobboAnalytics(authenticatedUser);
  const [menu, setMenu] = React.useState(() => ({
    canAccess: clientCanAccess,
    url: fallbackUrl,
  }));

  React.useEffect(() => {
    if (!authenticatedUser) {
      setMenu({ canAccess: false, url: null });
      return undefined;
    }

    const clientAccess = userCanAccessRobboAnalytics(authenticatedUser);
    const nextMenu = {
      canAccess: clientAccess,
      url: fallbackUrl,
    };
    setMenu(nextMenu);

    if (!config.LMS_BASE_URL) {
      return undefined;
    }

    let cancelled = false;
    fetch(`${config.LMS_BASE_URL}/api/robbo/v1/analytics-menu/`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data || data.can_access !== true) {
          return;
        }
        setMenu({
          canAccess: true,
          url: normalizeRobboAnalyticsUrl(data.url) || fallbackUrl,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [authenticatedUser, config.LMS_BASE_URL, fallbackUrl]);

  return menu;
}
