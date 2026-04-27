import en from './en.json';
import ru from './ru.json';
import enRobbo from './robbo-overrides/en.json';
import ruRobbo from './robbo-overrides/ru.json';

// Both `en` and locale catalogs are required: `getLocale()` falls back to `en` when the browser
// locale is English or unsupported; without `en`, `IntlProvider` receives no messages.
// Robbo header strings live under robbo-overrides/ and are re-injected into Atlas output via
// Makefile `pull_translations` → messages/robbo-custom/ (see intl-imports).
export default [{ en: { ...en, ...enRobbo }, ru: { ...ru, ...ruRobbo } }];
