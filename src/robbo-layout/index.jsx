/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import './index.scss';

const buildUrl = (baseUrl, path) => {
  if (!baseUrl) {
    return path;
  }
  return `${baseUrl.replace(/\/$/, '')}${path}`;
};

const getDashboardUrl = (config) => (
  config.LEARNER_HOME_MFE_URL
  || config.LEARNER_DASHBOARD_URL
  || buildUrl(config.LMS_BASE_URL, '/dashboard')
);

// LMS `/courses` first: Tutor often sets COURSE_SEARCH_URL to the learner app (same as dashboard).
const getCatalogUrl = (config) => (
  (config.LMS_BASE_URL && buildUrl(config.LMS_BASE_URL, '/courses'))
  || config.COURSE_SEARCH_URL
  || config.COURSE_CATALOG_URL
  || ''
);

const getProgramsUrl = (config) => buildUrl(config.LMS_BASE_URL, '/dashboard/programs');

export const RobboHeader = ({
  activeSection,
  onCatalogClick,
  showUserDropdown,
}) => {
  const { authenticatedUser } = React.useContext(AppContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const intl = useIntl();
  const config = getConfig();
  const dashboardUrl = getDashboardUrl(config);
  const catalogUrl = getCatalogUrl(config);
  const username = authenticatedUser?.username || authenticatedUser?.name || '';

  const mainLinks = [
    {
      href: dashboardUrl,
      messageId: 'robbo.header.mainNav.myCourses',
      section: 'dashboard',
    },
    ...(config.ENABLE_PROGRAMS ? [{
      href: getProgramsUrl(config),
      messageId: 'robbo.header.mainNav.programs',
      section: 'programs',
    }] : []),
    {
      href: catalogUrl,
      messageId: 'robbo.header.mainNav.courseCatalog',
      onClick: onCatalogClick,
      section: 'catalog',
    },
  ];

  // Same order as LMS `user_dropdown.html`: Profile, Sign Out (dashboard link omitted — Robbo).
  const userMenuLinks = [
    username && config.ACCOUNT_PROFILE_URL ? {
      href: `${config.ACCOUNT_PROFILE_URL}/u/${username}`,
      messageId: 'robbo.header.user.profile',
    } : null,
    config.LOGOUT_URL ? {
      href: config.LOGOUT_URL,
      messageId: 'robbo.header.user.signOut',
    } : null,
  ].filter(Boolean);

  return (
    <header className="robbo-layout-header">
      <div className="robbo-layout-header__inner">
        <div className="robbo-layout-header__leading">
          <a className="robbo-layout-header__brand" href={catalogUrl} aria-label="РОББО">
            <span className="robbo-layout-header__wordmark">
              РОББО
              <sup className="robbo-layout-header__reg" aria-hidden="true">®</sup>
            </span>
          </a>
        </div>
        <nav
          className="robbo-layout-header__nav"
          aria-label={intl.formatMessage({
            id: 'robbo.header.mainNav.aria',
            defaultMessage: 'Main navigation',
          })}
        >
          {mainLinks.map((item) => (
            <a
              key={`${item.href}-${item.messageId}`}
              className={activeSection === item.section ? 'robbo-layout-header__link active' : 'robbo-layout-header__link'}
              href={item.href}
              onClick={item.onClick}
              aria-current={activeSection === item.section ? 'page' : undefined}
            >
              <FormattedMessage id={item.messageId} />
            </a>
          ))}
        </nav>
        <div className="robbo-layout-header__trailing">
          {showUserDropdown && username && (
            <div className="robbo-layout-user-menu">
              <button
                className="robbo-layout-user-menu__toggle"
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label={intl.formatMessage({
                  id: 'robbo.header.user.toggleAria',
                  defaultMessage: 'Options Menu',
                })}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span>{username}</span>
              </button>
              {isUserMenuOpen && (
                <div
                  className="robbo-layout-user-menu__dropdown"
                  role="menu"
                  aria-label={intl.formatMessage({
                    id: 'robbo.header.user.menuDropdownAria',
                    defaultMessage: 'More Options',
                  })}
                >
                  {userMenuLinks.map((item) => (
                    <a
                      key={`${item.href}-${item.messageId}`}
                      className="robbo-layout-user-menu__item"
                      href={item.href}
                      role="menuitem"
                    >
                      <FormattedMessage id={item.messageId} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

RobboHeader.propTypes = {
  activeSection: PropTypes.oneOf(['catalog', 'dashboard', 'programs']),
  onCatalogClick: PropTypes.func,
  showUserDropdown: PropTypes.bool,
};

RobboHeader.defaultProps = {
  activeSection: null,
  onCatalogClick: undefined,
  showUserDropdown: true,
};

export const RobboFooter = () => (
  <div className="wrapper wrapper-footer">
    <footer id="footer" className="robbo-site-footer">
      <div className="robbo-site-footer__inner">
        <div className="robbo-footer__left">
          <div className="robbo-footer__brand">
            <span className="robbo-footer__logo" aria-label="РОББО">
              РОББО
              <sup className="robbo-footer__reg" aria-hidden="true">®</sup>
            </span>
          </div>
          <p className="robbo-footer__copyright">
            © ООО «РОББО ТЕХНОЛОГИИ», {new Date().getFullYear()}
          </p>
        </div>
        <div className="robbo-footer__center">
          <nav className="robbo-footer__nav" aria-label="Документы">
            <ul className="robbo-footer__links">
              <li>
                <a href="https://edurobbo.ru/skill" target="_blank" rel="noopener noreferrer">
                  Сведения об образовательной организации
                </a>
              </li>
              <li>
                <a href="https://robbo.ru/wp-content/uploads/policy.pdf" target="_blank" rel="noopener noreferrer">
                  Политика обработки персональных данных
                </a>
              </li>
              <li>
                <a href="https://robbo.ru/wp-content/uploads/agree.pdf" target="_blank" rel="noopener noreferrer">
                  Согласие на обработку персональных данных
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="robbo-footer__contacts">
          <p className="robbo-footer__contacts-title">Контактные данные:</p>
          <p className="robbo-footer__contacts-line">
            Почта <a href="mailto:skill@robbo.ru">skill@robbo.ru</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default RobboHeader;
