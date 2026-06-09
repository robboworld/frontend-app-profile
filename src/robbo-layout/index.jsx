/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import './index.scss';
import fasieLogo from './fasie-logo.png';

const MOBILE_COLLAPSE_NAV_QUERY = '(max-width: 767.98px)';

function useMatchMedia(query) {
  const [matches, setMatches] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

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

/** Account MFE uses PUBLIC_PATH `/account/`; basename requires a trailing slash. */
const getAccountSettingsUrl = (config) => {
  const base = config.ACCOUNT_SETTINGS_URL;
  if (!base) {
    return null;
  }
  return base.endsWith('/') ? base : `${base}/`;
};

export const RobboHeader = ({
  activeSection,
  onCatalogClick,
  showUserDropdown,
  collapseNavIntoUserMenuOnNarrow,
}) => {
  const { authenticatedUser } = React.useContext(AppContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const isNarrowViewport = useMatchMedia(MOBILE_COLLAPSE_NAV_QUERY);
  const collapseMainNav = Boolean(collapseNavIntoUserMenuOnNarrow && isNarrowViewport);
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

  const accountSettingsUrl = getAccountSettingsUrl(config);

  // Profile → Account → Sign Out (dashboard link omitted — Robbo).
  const userMenuLinks = [
    username && config.ACCOUNT_PROFILE_URL ? {
      href: `${config.ACCOUNT_PROFILE_URL}/u/${username}`,
      messageId: 'robbo.header.user.profile',
    } : null,
    accountSettingsUrl ? {
      href: accountSettingsUrl,
      messageId: 'robbo.header.user.account',
    } : null,
    config.LOGOUT_URL ? {
      href: config.LOGOUT_URL,
      messageId: 'robbo.header.user.signOut',
    } : null,
  ].filter(Boolean);

  const headerClassName = ['robbo-layout-header'];
  if (collapseMainNav) {
    headerClassName.push('robbo-layout-header--nav-collapsed');
  }

  return (
    <header className={headerClassName.join(' ')}>
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
          hidden={collapseMainNav}
          aria-hidden={collapseMainNav}
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
                className={[
                  'robbo-layout-user-menu__toggle',
                  collapseMainNav ? 'robbo-layout-user-menu__toggle--hamburger' : '',
                  collapseMainNav && isUserMenuOpen ? 'open' : '',
                ].filter(Boolean).join(' ')}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label={intl.formatMessage({
                  id: 'robbo.header.user.toggleAria',
                  defaultMessage: 'Options Menu',
                })}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {collapseMainNav ? (
                  <span className="robbo-layout-user-menu__hamburger" aria-hidden="true">
                    <span className="robbo-layout-user-menu__hamburger-line" />
                    <span className="robbo-layout-user-menu__hamburger-line" />
                    <span className="robbo-layout-user-menu__hamburger-line" />
                    <span className="robbo-layout-user-menu__hamburger-line" />
                  </span>
                ) : (
                  <span className="robbo-layout-user-menu__label">{username}</span>
                )}
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
                  {collapseMainNav && mainLinks.map((item) => (
                    <a
                      key={`menu-${item.href}-${item.messageId}`}
                      className={
                        ['robbo-layout-user-menu__item', 'robbo-layout-user-menu__item--main-nav',
                          activeSection === item.section ? 'active' : ''].filter(Boolean).join(' ')
                      }
                      href={item.href}
                      role="menuitem"
                      onClick={item.onClick}
                      aria-current={activeSection === item.section ? 'page' : undefined}
                    >
                      <FormattedMessage id={item.messageId} />
                    </a>
                  ))}
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
  /** Profile (LMS-like): logo + user only in bar; main nav links move into user menu ≤768px */
  collapseNavIntoUserMenuOnNarrow: PropTypes.bool,
};

RobboHeader.defaultProps = {
  activeSection: null,
  onCatalogClick: undefined,
  showUserDropdown: true,
  collapseNavIntoUserMenuOnNarrow: false,
};

const FooterMailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FooterGlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M3 12h18M12 3c2.5 2.8 2.5 14.2 0 18M12 3c-2.5 2.8-2.5 14.2 0 18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const FooterSupportIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path d="M4 11v3a2 2 0 002 2h1v-7H6a2 2 0 00-2 2zM18 9h1a2 2 0 012 2v3a2 2 0 01-2 2h-1V9z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
    <path d="M8 18v1a4 4 0 004 4 4 4 0 004-4v-1" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M12 14v-1a3 3 0 013-3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

export const RobboFooter = () => (
  <div className="wrapper wrapper-footer">
    <footer id="footer" className="robbo-site-footer">
      <div className="robbo-site-footer__inner">
        <div className="robbo-footer__main">
          <div className="robbo-footer__brand-col">
            <div className="robbo-footer__brand">
              <span className="robbo-footer__logo" aria-label="РОББО">
                РОББО
                <sup className="robbo-footer__reg" aria-hidden="true">®</sup>
              </span>
            </div>
            <p className="robbo-footer__tagline">Образовательная платформа РОББО</p>
            <p className="robbo-footer__copyright">
              © ООО «РОББО ТЕХНОЛОГИИ», {new Date().getFullYear()}
            </p>
          </div>
          <div className="robbo-footer__partner-col">
            <div className="robbo-footer__partner">
              <a
                className="robbo-footer__partner-link"
                href="https://fasie.ru"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="robbo-footer__partner-logo"
                  src={fasieLogo}
                  alt="Фонд содействия инновациям"
                />
              </a>
            </div>
          </div>
          <nav className="robbo-footer__col" aria-label="Документы">
            <h2 className="robbo-footer__heading">Документы</h2>
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
          <div className="robbo-footer__col robbo-footer__contacts-col">
            <h2 className="robbo-footer__heading">Контакты</h2>
            <ul className="robbo-footer__contacts-list">
              <li className="robbo-footer__contacts-item">
                <span className="robbo-footer__contacts-icon" aria-hidden="true">
                  <FooterMailIcon />
                </span>
                <a
                  className="robbo-footer__contacts-link"
                  href="mailto:info@robbo.ru"
                  aria-label="Почта: info@robbo.ru"
                >
                  info@robbo.ru
                </a>
              </li>
              <li className="robbo-footer__contacts-item">
                <span className="robbo-footer__contacts-icon" aria-hidden="true">
                  <FooterGlobeIcon />
                </span>
                <a
                  className="robbo-footer__contacts-link"
                  href="https://robbo.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Наш сайт: robbo.ru"
                >
                  robbo.ru
                </a>
              </li>
              <li className="robbo-footer__contacts-item">
                <span className="robbo-footer__contacts-icon" aria-hidden="true">
                  <FooterSupportIcon />
                </span>
                <a
                  className="robbo-footer__contacts-link"
                  href="https://support.robbo.world/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Поддержка: support.robbo.world"
                >
                  support.robbo.world
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default RobboHeader;
