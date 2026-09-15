/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

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

export const RobboFooterMainNav = ({ config, dashboardUrl, catalogUrl }) => {
  const intl = useIntl();
  const lkUrl = getRobboLkSsoUrl(config);
  if (!lkUrl) {
    return null;
  }

  return (
    <nav
      className="robbo-footer__col robbo-footer__nav-col"
      aria-label={intl.formatMessage({
        id: 'robbo.footer.mainNav.aria',
        defaultMessage: 'Site sections',
        description: 'Footer navigation column when LK integration is enabled',
      })}
    >
      <h2 className="robbo-footer__heading">
        <FormattedMessage
          id="robbo.footer.mainNav.heading"
          defaultMessage="Sections"
          description="Footer navigation heading when LK integration is enabled"
        />
      </h2>
      <ul className="robbo-footer__links">
        <li>
          <a href={dashboardUrl}>
            <FormattedMessage
              id="robbo.header.mainNav.myCourses"
              defaultMessage="My Courses"
              description="Main nav link to learner dashboard"
            />
          </a>
        </li>
        <li>
          <a href={catalogUrl}>
            <FormattedMessage
              id="robbo.header.mainNav.courseCatalog"
              defaultMessage="Course catalog"
              description="Main nav link to course catalog"
            />
          </a>
        </li>
        <li>
          <a href={lkUrl}>
            <FormattedMessage
              id="robbo.header.mainNav.personalAccount"
              defaultMessage="Personal account"
              description="Main nav link to Robbo LK via BFF SSO"
            />
          </a>
        </li>
      </ul>
    </nav>
  );
};
