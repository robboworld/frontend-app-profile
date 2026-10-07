/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const isRobboLkNavEnabled = (config) => Boolean(config?.ROBBO_LK_SSO_URL);

export const getRobboLkSsoUrl = (config) => (
  isRobboLkNavEnabled(config) ? config.ROBBO_LK_SSO_URL : null
);

export const getRobboLkHeaderNavItem = (config) => {
  const href = getRobboLkSsoUrl(config);
  if (!href) {
    return null;
  }
  return {
    href,
    messageId: 'robbo.header.mainNav.personalAccount',
    section: 'lk',
  };
};
