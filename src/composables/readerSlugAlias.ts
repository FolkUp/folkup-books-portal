/**
 * Reader slug alias + manifest-driven existence check для language switcher.
 *
 * Origin: S309-12 P1 fix (Iskra TIKET-PATCH 2026-08-31 S1DEFIX cont+4).
 * `buildLangUrl` в App.vue раньше переносил хвост `/read/<slug>` дословно, но slug
 * аппарата у RU и EN разный (RU `apparatus-predmetnyy-ukazatel`, EN `apparatus-subject-index`).
 * Переключатель RU→EN на странице указателя давал 404.
 *
 * API:
 *   - `READER_SLUG_ALIAS` — карта расхождений slug'ов между языками
 *   - `localizeReaderSlug(slug, target)` — конвертирует slug в target lang через alias-map
 *   - `hasReaderEntryInLang(book, lang, slug)` — проверяет существование slug в manifest
 *     целевого языка (kn1 multi-lang; kn3-5 RU-only; kn2/6/7 без reader)
 *
 * Iskra §2.5 связка: preview state тоже имеет reader если route существует (kn1 PT
 * preview + reader live). Manifest check закрывает и будущий PT-случай апарата без
 * нового тикета — когда PT указатель переведут, добавить в alias-map + PT manifest.
 */

import { useKn1ChapterSlugsLang } from './useKn1Chapters'

export type SupportedLocale = 'ru' | 'en' | 'pt' | 'de'

/**
 * Slug alias между языками для случаев, где перевод изменил URL (не только текст).
 * Формат: `<source-slug>: { <target-lang>: <target-slug> }`.
 */
export const READER_SLUG_ALIAS: Record<
  string,
  Partial<Record<SupportedLocale, string>>
> = {
  'apparatus-predmetnyy-ukazatel': { en: 'apparatus-subject-index' },
  'apparatus-subject-index': { ru: 'apparatus-predmetnyy-ukazatel' },
}

/**
 * Возвращает slug для target lang через alias-map. Если alias отсутствует — slug
 * без изменений (совпадающие slug-и типа `apparatus-sources` не требуют alias).
 */
export function localizeReaderSlug(
  slug: string,
  target: SupportedLocale,
): string {
  return READER_SLUG_ALIAS[slug]?.[target] ?? slug
}

/**
 * Существует ли slug в manifest целевого языка? Используется switcher-ом для
 * решения: перенести хвост в целевой lang OR fallback к оглавлению.
 *
 * Currently only kn1 has multi-lang reader (RU + EN live, PT preview).
 * kn2/6/7 без reader вообще; kn3-5 RU-only. Для них вернёт false для не-RU
 * (уже покрыто вышестоящим translations status check в `buildLangUrl`).
 * DE guard: kn1 DE manifest не существует (Bolik pipeline в pipeline).
 */
export function hasReaderEntryInLang(
  book: string,
  lang: SupportedLocale,
  slug: string,
): boolean {
  if (book !== 'kn1') return false
  if (lang === 'de') return false
  return useKn1ChapterSlugsLang(lang as 'ru' | 'pt' | 'en').includes(slug)
}
