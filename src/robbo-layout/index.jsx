import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
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

const getCatalogUrl = (config) => (
  config.COURSE_SEARCH_URL
  || config.COURSE_CATALOG_URL
  || buildUrl(config.LMS_BASE_URL, '/courses')
);

const getProgramsUrl = (config) => buildUrl(config.LMS_BASE_URL, '/dashboard/programs');

export const RobboHeader = ({
  activeSection,
  onCatalogClick,
  showUserDropdown,
}) => {
  const { authenticatedUser } = React.useContext(AppContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const config = getConfig();
  const dashboardUrl = getDashboardUrl(config);
  const catalogUrl = getCatalogUrl(config);
  const username = authenticatedUser?.username || authenticatedUser?.name || '';

  const mainLinks = [
    {
      href: dashboardUrl,
      label: 'Мои курсы',
      section: 'dashboard',
    },
    ...(config.ENABLE_PROGRAMS ? [{
      href: getProgramsUrl(config),
      label: 'Programs',
      section: 'programs',
    }] : []),
    {
      href: catalogUrl,
      label: 'Course catalog',
      onClick: onCatalogClick,
      section: 'catalog',
    },
  ];

  const userLinks = [
    username && config.ACCOUNT_PROFILE_URL ? {
      href: `${config.ACCOUNT_PROFILE_URL}/u/${username}`,
      label: 'Profile',
    } : null,
    config.ACCOUNT_SETTINGS_URL ? {
      href: config.ACCOUNT_SETTINGS_URL,
      label: 'Account',
    } : null,
    config.ORDER_HISTORY_URL ? {
      href: config.ORDER_HISTORY_URL,
      label: 'Order History',
    } : null,
    config.LOGOUT_URL ? {
      href: config.LOGOUT_URL,
      label: 'Sign Out',
    } : null,
  ].filter(Boolean);

  return (
    <header className="robbo-layout-header">
      <div className="robbo-layout-header__inner">
        <div className="robbo-layout-header__leading">
          <a className="robbo-layout-header__brand" href={buildUrl(config.LMS_BASE_URL, '/')} aria-label="РОББО">
            <span className="robbo-layout-header__wordmark">
              РОББО
              <sup className="robbo-layout-header__reg" aria-hidden="true">®</sup>
            </span>
          </a>
        </div>
        <nav className="robbo-layout-header__nav" aria-label="Основная навигация">
          {mainLinks.map((item) => (
            <a
              key={`${item.href}-${item.label}`}
              className={activeSection === item.section ? 'robbo-layout-header__link active' : 'robbo-layout-header__link'}
              href={item.href}
              onClick={item.onClick}
              aria-current={activeSection === item.section ? 'page' : undefined}
            >
              {item.label}
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
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span>{username}</span>
              </button>
              {isUserMenuOpen && (
                <div className="robbo-layout-user-menu__dropdown" role="menu">
                  {userLinks.map((item) => (
                    <a
                      key={`${item.href}-${item.label}`}
                      className="robbo-layout-user-menu__item"
                      href={item.href}
                      role="menuitem"
                    >
                      {item.label}
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
                <a href="https://edurobbo.ru/doc" target="_blank" rel="noopener noreferrer">
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
