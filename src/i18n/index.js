import en from './en.json';
import ru from './ru.json';

// Both `en` and locale catalogs are required: `getLocale()` falls back to `en` when the browser
// locale is English or unsupported; without `en`, `IntlProvider` receives no messages.
export default [{ en, ru }];
