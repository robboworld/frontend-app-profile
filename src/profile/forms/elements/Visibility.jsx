import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

import messages from './Visibility.messages';
import RobboSelect from '../../components/RobboSelect';

const Visibility = ({ to, intl }) => {
  const icon = to === 'private' ? faEyeSlash : faEye;
  const label = to === 'private'
    ? intl.formatMessage(messages['profile.visibility.who.just.me'])
    : intl.formatMessage(messages['profile.visibility.who.everyone'], { siteName: getConfig().SITE_NAME });

  return (
    <span className="ml-auto small text-muted">
      <FontAwesomeIcon icon={icon} /> {label}
    </span>
  );
};

Visibility.propTypes = {
  to: PropTypes.oneOf(['private', 'all_users']),

  // i18n
  intl: intlShape.isRequired,
};
Visibility.defaultProps = {
  to: 'private',
};

const VisibilitySelect = ({ intl, className, ...props }) => {
  const { value, id, name, onChange } = props;
  const icon = value === 'private' ? faEyeSlash : faEye;

  return (
    <span className={className}>
      <span className="d-inline-block ml-1 mr-2" style={{ width: '1.5rem' }}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <RobboSelect
        id={id}
        name={name}
        className="robbo-select--inline"
        value={value}
        onChange={onChange}
        options={[
          {
            value: 'private',
            label: intl.formatMessage(messages['profile.visibility.who.just.me']),
          },
          {
            value: 'all_users',
            label: intl.formatMessage(messages['profile.visibility.who.everyone'], {
              siteName: getConfig().SITE_NAME,
            }),
          },
        ]}
      />
    </span>
  );
};

VisibilitySelect.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOf(['private', 'all_users']),
  onChange: PropTypes.func,

  // i18n
  intl: intlShape.isRequired,
};
VisibilitySelect.defaultProps = {
  id: null,
  className: null,
  name: 'visibility',
  value: null,
  onChange: null,
};

const intlVisibility = injectIntl(Visibility);
const intlVisibilitySelect = injectIntl(VisibilitySelect);

export {
  intlVisibility as Visibility,
  intlVisibilitySelect as VisibilitySelect,
};
