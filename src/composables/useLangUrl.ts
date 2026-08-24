import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

/**
 * useLangUrl — TIKET-31 EXT lang persistence fix (Andrey mandate cont+7 EXT 2026-08-24):
 * «если человек выбрал какой-то язык он будет с ним до конца пока он не выберет другой».
 *
 * Prior state: internal RouterLinks hard-coded `to="/"` и `to="/kn{N}"` — watcher видел
 * meta.lang=undefined и сбрасывал i18n locale к RU. User терял выбор языка при переходе
 * на главную / book cards.
 *
 * Fix: langUrl(path) helper префиксует path с current lang (кроме RU).
 * Использовать в internal RouterLinks вместо hard-coded paths.
 *
 * Usage:
 *   const { langUrl } = useLangUrl()
 *   <RouterLink :to="langUrl('/')">   → /pt/ (если user в PT mode)
 *   <RouterLink :to="langUrl('/kn1')">→ /pt/kn1 (stub) OR /kn1 (RU)
 */

const SUPPORTED_LOCALES = ['ru', 'en', 'pt', 'de'] as const
type OgLang = (typeof SUPPORTED_LOCALES)[number]

export function useLangUrl() {
  const route = useRoute()
  const { locale } = useI18n()

  const currentLang = computed<OgLang>(() => {
    const metaLang = route.meta.lang
    if (
      typeof metaLang === 'string' &&
      SUPPORTED_LOCALES.includes(metaLang as OgLang)
    ) {
      return metaLang as OgLang
    }
    return locale.value as OgLang
  })

  const langPrefix = computed(() =>
    currentLang.value === 'ru' ? '' : `/${currentLang.value}`,
  )

  const langUrl = (path: string): string => {
    // Root path — return lang home
    if (path === '/' || path === '') {
      return currentLang.value === 'ru' ? '/' : `/${currentLang.value}`
    }
    // Ensure leading slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    // For reader routes /kn{N}/read/* — lang goes inside path (not prefix)
    // Convert /kn{N}/read/* к /kn{N}/{lang}/read/* if not RU
    const readerMatch = cleanPath.match(/^\/(kn\d+)\/read(\/.*)?$/)
    if (readerMatch && currentLang.value !== 'ru') {
      const [, book, tail = ''] = readerMatch
      return `/${book}/${currentLang.value}/read${tail}`
    }
    // Standard path — prepend lang prefix
    return `${langPrefix.value}${cleanPath}`
  }

  return { currentLang, langPrefix, langUrl }
}
