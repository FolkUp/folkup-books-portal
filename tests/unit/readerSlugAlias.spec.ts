/**
 * Unit tests for reader slug alias-map + manifest-driven existence check.
 *
 * Iskra TIKET-PATCH S309-12 §2.4 (2026-08-31): 3 canonical assertions +
 * boundary cases для покрытия alias-map + hasReaderEntryInLang guards.
 */

import { describe, it, expect } from 'vitest'
import {
  READER_SLUG_ALIAS,
  localizeReaderSlug,
  hasReaderEntryInLang,
} from '../../src/composables/readerSlugAlias'

describe('READER_SLUG_ALIAS canonical form', () => {
  it('содержит bidirectional alias для указателя (RU↔EN)', () => {
    expect(READER_SLUG_ALIAS['apparatus-predmetnyy-ukazatel']).toEqual({
      en: 'apparatus-subject-index',
    })
    expect(READER_SLUG_ALIAS['apparatus-subject-index']).toEqual({
      ru: 'apparatus-predmetnyy-ukazatel',
    })
  })
})

describe('localizeReaderSlug — Iskra §2.4 canonical assertions', () => {
  it('RU apparatus-predmetnyy-ukazatel → EN apparatus-subject-index', () => {
    expect(localizeReaderSlug('apparatus-predmetnyy-ukazatel', 'en')).toBe(
      'apparatus-subject-index',
    )
  })

  it('EN apparatus-subject-index → RU apparatus-predmetnyy-ukazatel', () => {
    expect(localizeReaderSlug('apparatus-subject-index', 'ru')).toBe(
      'apparatus-predmetnyy-ukazatel',
    )
  })

  it('slug без alias возвращается без изменений (apparatus-sources совпадает во всех локалях)', () => {
    expect(localizeReaderSlug('apparatus-sources', 'en')).toBe('apparatus-sources')
    expect(localizeReaderSlug('apparatus-sources', 'pt')).toBe('apparatus-sources')
    expect(localizeReaderSlug('chapter-3-holmes', 'en')).toBe('chapter-3-holmes')
  })

  it('target lang без alias для данного slug возвращает исходный slug', () => {
    // apparatus-predmetnyy-ukazatel имеет alias только для EN, не для PT
    expect(localizeReaderSlug('apparatus-predmetnyy-ukazatel', 'pt')).toBe(
      'apparatus-predmetnyy-ukazatel',
    )
  })
})

describe('hasReaderEntryInLang — manifest-driven existence check', () => {
  it('kn1 RU manifest содержит apparatus-predmetnyy-ukazatel', () => {
    expect(hasReaderEntryInLang('kn1', 'ru', 'apparatus-predmetnyy-ukazatel')).toBe(
      true,
    )
  })

  it('kn1 EN manifest содержит apparatus-subject-index', () => {
    expect(hasReaderEntryInLang('kn1', 'en', 'apparatus-subject-index')).toBe(true)
  })

  it('kn1 PT manifest НЕ содержит указатель (нет ни apparatus-predmetnyy-ukazatel ни apparatus-subject-index) → fallback', () => {
    expect(
      hasReaderEntryInLang('kn1', 'pt', 'apparatus-predmetnyy-ukazatel'),
    ).toBe(false)
    expect(hasReaderEntryInLang('kn1', 'pt', 'apparatus-subject-index')).toBe(false)
  })

  it('kn1 apparatus-sources присутствует во всех трёх manifests', () => {
    expect(hasReaderEntryInLang('kn1', 'ru', 'apparatus-sources')).toBe(true)
    expect(hasReaderEntryInLang('kn1', 'en', 'apparatus-sources')).toBe(true)
    expect(hasReaderEntryInLang('kn1', 'pt', 'apparatus-sources')).toBe(true)
  })

  it('DE guard — kn1 DE manifest не существует, всегда false', () => {
    expect(hasReaderEntryInLang('kn1', 'de', 'apparatus-sources')).toBe(false)
    expect(hasReaderEntryInLang('kn1', 'de', 'apparatus-predmetnyy-ukazatel')).toBe(
      false,
    )
  })

  it('non-kn1 books возвращают false (kn3-5 RU-only, kn2/6/7 без reader — покрыто translations check в buildLangUrl)', () => {
    expect(hasReaderEntryInLang('kn3', 'en', 'chapter-1')).toBe(false)
    expect(hasReaderEntryInLang('kn5', 'pt', 'chapter-1')).toBe(false)
    expect(hasReaderEntryInLang('kn2', 'ru', 'anything')).toBe(false)
  })

  it('несуществующий slug в kn1 — возвращает false (fallback к оглавлению)', () => {
    expect(hasReaderEntryInLang('kn1', 'en', 'nonexistent-chapter')).toBe(false)
    expect(hasReaderEntryInLang('kn1', 'ru', 'apparatus-subject-index')).toBe(false) // EN slug в RU
  })
})

describe('S309-12 integration scenarios — full pipeline localizeReaderSlug + hasReaderEntryInLang', () => {
  it('переключатель RU→EN на apparatus указателе: localize → check → должен найти', () => {
    // Пользователь на /kn1/read/apparatus-predmetnyy-ukazatel кликает EN
    const currentSlug = 'apparatus-predmetnyy-ukazatel'
    const targetLang = 'en'
    const localized = localizeReaderSlug(currentSlug, targetLang)
    const exists = hasReaderEntryInLang('kn1', targetLang, localized)
    expect(localized).toBe('apparatus-subject-index')
    expect(exists).toBe(true)
    // buildLangUrl должен вернуть /kn1/en/read/apparatus-subject-index (не 404)
  })

  it('переключатель EN→RU на apparatus указателе: обратный alias работает', () => {
    const currentSlug = 'apparatus-subject-index'
    const targetLang = 'ru'
    const localized = localizeReaderSlug(currentSlug, targetLang)
    const exists = hasReaderEntryInLang('kn1', targetLang, localized)
    expect(localized).toBe('apparatus-predmetnyy-ukazatel')
    expect(exists).toBe(true)
  })

  it('переключатель RU→PT на указателе (нет alias + нет в PT manifest): fallback к оглавлению', () => {
    const currentSlug = 'apparatus-predmetnyy-ukazatel'
    const targetLang = 'pt'
    const localized = localizeReaderSlug(currentSlug, targetLang)
    const exists = hasReaderEntryInLang('kn1', targetLang, localized)
    expect(localized).toBe('apparatus-predmetnyy-ukazatel') // no alias to PT
    expect(exists).toBe(false)
    // buildLangUrl должен вернуть /kn1/pt/read (оглавление), не /kn1/pt/read/apparatus-predmetnyy-ukazatel (404)
  })
})
