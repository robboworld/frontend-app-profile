import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.viewMyRecords': {
    id: 'profile.viewMyRecords',
    defaultMessage: 'View My Records',
    description: 'A link to go view my academic records',
  },
  'profile.loading': {
    id: 'profile.loading',
    defaultMessage: 'Profile loading...',
    description: 'Message displayed when the profile data is loading.',
  },
  'profile.accountSettings.cta': {
    id: 'profile.accountSettings.cta',
    defaultMessage: 'Account settings',
    description: 'Link to the account micro-frontend (date of birth, account profile fields, etc.).',
  },
});

export default messages;
