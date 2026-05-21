import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trCommon from '../../content/strings/tr/common.json';
import trOnboarding from '../../content/strings/tr/onboarding.json';
import trLesson from '../../content/strings/tr/lesson.json';
import trParent from '../../content/strings/tr/parent.json';

const NAMESPACES = ['common', 'onboarding', 'lesson', 'parent'] as const;

const trResources = {
  common: trCommon,
  onboarding: trOnboarding,
  lesson: trLesson,
  parent: trParent,
};

let initialized = false;

export async function initI18n(): Promise<void> {
  if (initialized) return;
  await i18n.use(initReactI18next).init({
    lng: 'tr',
    fallbackLng: 'tr',
    ns: [...NAMESPACES],
    defaultNS: 'common',
    resources: {
      tr: trResources,
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  initialized = true;
}

const loadedLocales = new Set<string>(['tr']);

interface ResourceModule {
  default: Record<string, unknown>;
}

async function loadLocaleBundle(locale: 'en' | 'de'): Promise<void> {
  if (loadedLocales.has(locale)) return;
  const modules = (await Promise.all(
    NAMESPACES.map(
      (ns) =>
        import(/* @vite-ignore */ `../../content/strings/${locale}/${ns}.json`)
    )
  )) as ResourceModule[];
  NAMESPACES.forEach((ns, idx) => {
    const moduleEntry = modules[idx];
    if (!moduleEntry) return;
    i18n.addResourceBundle(locale, ns, moduleEntry.default, true, true);
  });
  loadedLocales.add(locale);
}

export async function setLocale(locale: 'tr' | 'en' | 'de'): Promise<void> {
  if (!initialized) await initI18n();
  if (locale !== 'tr') await loadLocaleBundle(locale);
  await i18n.changeLanguage(locale);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

export { i18n };
