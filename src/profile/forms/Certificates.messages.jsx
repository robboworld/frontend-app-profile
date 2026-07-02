import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.certificates.my.certificates': {
    id: 'profile.certificates.my.certificates',
    defaultMessage: 'My Certificates',
    description: 'A section of a user profile',
  },
  'profile.certificates.view.certificate': {
    id: 'profile.certificates.view.certificate',
    defaultMessage: 'View Certificate',
    description: 'A call to action to view a certificate',
  },
  'profile.certificates.types.verified': {
    id: 'profile.certificates.types.verified',
    defaultMessage: 'Verified Certificate',
    description: 'A type of certificate a user may have earned',
  },
  'profile.certificates.types.professional': {
    id: 'profile.certificates.types.professional',
    defaultMessage: 'Professional Certificate',
    description: 'A type of certificate a user may have earned',
  },
  'profile.certificates.types.unknown': {
    id: 'profile.certificates.types.unknown',
    defaultMessage: 'Certificate',
    description: 'The string to display when a certificate is of an unknown type',
  },
  'profile.certificates.types.honor': {
    id: 'profile.certificates.types.honor',
    defaultMessage: 'Certificate',
    description: 'Honor track certificate label on profile',
  },
  'profile.certificates.types.audit': {
    id: 'profile.certificates.types.audit',
    defaultMessage: 'Certificate',
    description: 'Audit track certificate label on profile',
  },
  'profile.certificate.organization.label': {
    id: 'profile.certificate.organization.label',
    defaultMessage: 'From',
    description: 'Label before course organization on certificate card',
  },
  'profile.certificate.completion.date.label': {
    id: 'profile.certificate.completion.date.label',
    defaultMessage: 'Completed on {date}',
    description: 'Certificate completion date on profile card',
  },
});

export default messages;
