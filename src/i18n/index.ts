import { content, type SiteContent } from '../content/site';

export type Lang = keyof typeof content;
export const defaultLang: Lang = 'nl';

/** Returns all copy for a language. Only 'nl' exists for now; add 'en' to content later. */
export function t(lang: Lang = defaultLang): SiteContent {
  return content[lang] ?? content[defaultLang];
}

/** True when a string still holds a placeholder to be supplied. */
export const isTodo = (s: string | undefined | null) => !!s && s.includes('[INVULLEN');

/**
 * Placeholders are visible in `astro dev` and in builds with SHOW_PLACEHOLDERS=1.
 * In a normal production build they are removed.
 */
export const showTodos =
  import.meta.env.DEV || (typeof process !== 'undefined' && process.env?.SHOW_PLACEHOLDERS === '1');

/**
 * Text ready to render. In production, every sentence that contains a placeholder is dropped;
 * an empty string means "leave this item out".
 */
export function clean(s: string | undefined | null): string {
  if (!s) return '';
  if (!isTodo(s) || showTodos) return s;
  return s
    .split(/(?<=[.!?])\s+/)
    .filter((part) => !isTodo(part))
    .join(' ')
    .trim();
}

/** True when there is something to render for this text. */
export const present = (s: string | undefined | null) => clean(s) !== '';

/** True when a link points somewhere real. */
export const isRealHref = (s: string | undefined | null) => !!s && !isTodo(s);

/** A contact detail or link: real, or a placeholder that may be shown in dev. */
export const showDetail = (s: string | undefined | null) => isRealHref(s) || (showTodos && !!s);
