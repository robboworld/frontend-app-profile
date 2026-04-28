import en from './en.json';
import ru from './ru.json';
import enRobbo from './robbo-overrides/en.json';
import ruRobbo from './robbo-overrides/ru.json';

// Both `en` and locale catalogs are required: `getLocale()` falls back to `en` when the browser
// locale is English or unsupported; without `en`, `IntlProvider` receives no messages.
// Robbo strings that must survive `make pull_translations` (Atlas + intl-imports) belong in
// robbo-overrides/: that package is merged last and overrides openedx-translations.
export default [{ en: { ...en, ...enRobbo }, ru: { ...ru, ...ruRobbo } }];
