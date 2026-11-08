import { content, type SiteContent } from '../content/site';

export type Lang = keyof typeof content;
export const defaultLang: Lang = 'nl';

/** Returns all copy for a language. Only 'nl' exists for now; add 'en' to content later. */
export function t(lang: Lang = defaultLang): SiteContent {
  return content[lang] ?? content[defaultLang];
}

/** True when a string is still a placeholder to be supplied. */
export const isTodo = (s: string | undefined | null) => !!s && s.includes('[INVULLEN');

/** True when a link points somewhere real. */
export const isRealHref = (s: string | undefined | null) => !!s && !isTodo(s);
