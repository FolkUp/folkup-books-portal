<script setup lang="ts">
/**
 * Standalone «Про что книга» page per book + per lang.
 * Routes: /kn{N}/{lang}/pro-chto/ — dedicated URL rendering pro-chto.md content
 * outside BookPage.vue's showLongProChto suppression rule (S242 §1 preserves
 * inline suppression для books с access methods; standalone page = separate concept
 * per Iskra S299-05 KANON PORTAL-LANG-PARITY-1 + Iskra S299-14 §1 DEFAULT-GO canon).
 *
 * Origin: PRO-CHTO-EN-1 (P2 Iskra S297), Iskra S299-11 assignment «код-путь консоли»,
 * Option A.3 per Alisa KVIT-22 (2026-08-24 cont+5) — architectural gap resolution.
 * First implementation: /kn1/en/pro-chto/ (Лёлик draft ratified Iskra Vier-Augen S299-10).
 * Extendable pattern: /kn{N}/{lang}/pro-chto/ (kn.4/5/6 когда Iskra Vier-Augen PASS).
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useSeriesData } from '../composables/useSeriesData'

// Reuse pro-chto content glob pattern from BookPage.vue — single source of truth.
const proChtoModules = import.meta.glob<string>(
  '../../content/kn*/*/pro-chto.md',
  { query: '?raw', import: 'default', eager: true },
)

const route = useRoute()
const { t } = useI18n()
const { bookBySlug } = useSeriesData()

type Lang = 'ru' | 'pt' | 'en' | 'de'
const SUPPORTED_LANGS: Lang[] = ['ru', 'pt', 'en', 'de']

const lang = computed<Lang>(() => {
  const metaLang = route.meta.lang
  if (typeof metaLang === 'string' && SUPPORTED_LANGS.includes(metaLang as Lang)) {
    return metaLang as Lang
  }
  return 'ru'
})

const slug = computed<string>(() => {
  const metaSlug = route.meta.bookSlug
  return typeof metaSlug === 'string' ? metaSlug : 'kn1'
})

const book = computed(() => bookBySlug(slug.value))

// Reuse BookPage.vue escape+bold-markdown render pattern.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function renderMarkdown(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
}

// Load pro-chto content per lang, fallback RU (per Iskra S244 §4 cascade canon).
const proChtoContent = computed(() => {
  const localePath = `../../content/${slug.value}/${lang.value}/pro-chto.md`
  const fallbackPath = `../../content/${slug.value}/ru/pro-chto.md`
  const raw = proChtoModules[localePath] ?? proChtoModules[fallbackPath]
  if (!raw) return { heading: '', paragraphs: [] as string[], hasFallback: false }

  const usedFallback = !proChtoModules[localePath] && !!proChtoModules[fallbackPath]

  // Parse: strip HTML comments, extract first `# Heading` if present, collect paragraphs.
  const parts = raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('<!--'))

  let heading = ''
  const paragraphs: string[] = []

  for (const part of parts) {
    if (part.startsWith('# ')) {
      heading = part.slice(2).trim()
    } else if (!part.startsWith('#')) {
      paragraphs.push(renderMarkdown(part))
    }
  }

  return { heading, paragraphs, hasFallback: usedFallback }
})

const bookTitle = computed(() => t(`books.${slug.value}.title`))

const SITE_URL = 'https://books.folkup.life'

// URL path segment (RU has no lang segment).
const langSegment = computed(() => (lang.value === 'ru' ? '' : `/${lang.value}`))
const pageUrl = computed(() => `${SITE_URL}/${slug.value}${langSegment.value}/pro-chto/`)
const bookUrl = computed(() => `${SITE_URL}/${slug.value}${langSegment.value}`)

// hreflang alternates — enumerate langs где pro-chto file exists (per S244 §4 file existence check).
const hreflangAlternates = computed(() => {
  const alts: { hreflang: string; href: string }[] = []
  const hreflangMap: Record<Lang, string> = {
    ru: 'ru',
    en: 'en',
    pt: 'pt-PT',
    de: 'de',
  }
  for (const l of SUPPORTED_LANGS) {
    const path = `../../content/${slug.value}/${l}/pro-chto.md`
    if (proChtoModules[path]) {
      const seg = l === 'ru' ? '' : `/${l}`
      alts.push({
        hreflang: hreflangMap[l],
        href: `${SITE_URL}/${slug.value}${seg}/pro-chto/`,
      })
    }
  }
  // x-default → RU (canonical fallback per portal convention).
  alts.push({ hreflang: 'x-default', href: `${SITE_URL}/${slug.value}/pro-chto/` })
  return alts
})

// Localized page titles + navigation labels.
const PAGE_LABELS: Record<Lang, {
  metaTitleSuffix: string
  metaDescriptionPrefix: string
  backToBook: string
  fallbackNote: string
}> = {
  ru: {
    metaTitleSuffix: 'Про что книга',
    metaDescriptionPrefix: 'О чём книга',
    backToBook: '← К странице книги',
    fallbackNote: 'Перевод этой страницы готовится. Показан оригинал на русском.',
  },
  en: {
    metaTitleSuffix: 'What This Book Is About',
    metaDescriptionPrefix: 'About the book',
    backToBook: '← Back to book page',
    fallbackNote: 'Translation of this page is in progress. Showing Russian original.',
  },
  pt: {
    metaTitleSuffix: 'Sobre o livro',
    metaDescriptionPrefix: 'Sobre o livro',
    backToBook: '← Voltar à página do livro',
    fallbackNote: 'A tradução desta página está em preparação. A mostrar o original em russo.',
  },
  de: {
    metaTitleSuffix: 'Worum es in diesem Buch geht',
    metaDescriptionPrefix: 'Über das Buch',
    backToBook: '← Zurück zur Buchseite',
    fallbackNote: 'Die Übersetzung dieser Seite wird vorbereitet. Original auf Russisch angezeigt.',
  },
}

const labels = computed(() => PAGE_LABELS[lang.value])

const metaTitle = computed(
  () => `${labels.value.metaTitleSuffix} — «${bookTitle.value}» · FolkUp`,
)

// Truncated first paragraph для meta description (~160 chars safe range).
const metaDescription = computed(() => {
  const first = proChtoContent.value.paragraphs[0] ?? ''
  const stripped = first.replace(/<[^>]+>/g, '').trim()
  return stripped.length > 160 ? stripped.slice(0, 157) + '…' : stripped
})

useHead({
  title: metaTitle,
  htmlAttrs: {
    lang: computed(() => lang.value),
  },
  meta: [
    { name: 'description', content: metaDescription },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:locale', content: computed(() =>
      lang.value === 'ru' ? 'ru_RU'
      : lang.value === 'en' ? 'en_US'
      : lang.value === 'pt' ? 'pt_PT'
      : 'de_DE',
    ) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', content: metaDescription },
  ],
  link: [
    { rel: 'canonical', href: pageUrl },
    ...hreflangAlternates.value.map((alt) => ({
      rel: 'alternate',
      hreflang: alt.hreflang,
      href: alt.href,
    })),
  ],
})
</script>

<template>
  <article class="pro-chto-page">
    <nav class="pro-chto-page__breadcrumbs" aria-label="Breadcrumb">
      <RouterLink :to="bookUrl.replace(SITE_URL, '')" class="pro-chto-page__breadcrumb-link">
        {{ labels.backToBook }}
      </RouterLink>
    </nav>

    <p
      v-if="proChtoContent.hasFallback"
      class="pro-chto-page__fallback-note"
      role="note"
    >
      {{ labels.fallbackNote }}
    </p>

    <h1 v-if="proChtoContent.heading" class="pro-chto-page__heading">
      {{ proChtoContent.heading }}
    </h1>

    <section
      class="pro-chto-page__body"
      :aria-label="labels.metaTitleSuffix"
    >
      <p
        v-for="(para, index) in proChtoContent.paragraphs"
        :key="index"
        class="pro-chto-page__paragraph"
        v-html="para"
      ></p>
    </section>
  </article>
</template>

<style scoped>
.pro-chto-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  font-family: Georgia, 'Times New Roman', serif;
  color: #2d2d2d;
  line-height: 1.7;
}

.pro-chto-page__breadcrumbs {
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.pro-chto-page__breadcrumb-link {
  color: #666;
  text-decoration: none;
  transition: color 0.15s ease;
}

.pro-chto-page__breadcrumb-link:hover,
.pro-chto-page__breadcrumb-link:focus {
  color: #2d2d2d;
  text-decoration: underline;
}

.pro-chto-page__fallback-note {
  font-size: 0.9rem;
  color: #6b6b6b;
  font-style: italic;
  background: #f8f6f0;
  border-left: 3px solid #d4c896;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
  border-radius: 4px;
}

.pro-chto-page__heading {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 2rem;
  color: #1a1a1a;
}

.pro-chto-page__body {
  font-size: 1.1rem;
}

.pro-chto-page__paragraph {
  margin: 0 0 1.5rem;
}

.pro-chto-page__paragraph:last-child {
  margin-bottom: 0;
}

.pro-chto-page__paragraph :deep(strong) {
  font-weight: 600;
}

@media (min-width: 768px) {
  .pro-chto-page {
    padding: 3rem 2rem 5rem;
  }

  .pro-chto-page__heading {
    font-size: 2.4rem;
  }

  .pro-chto-page__body {
    font-size: 1.15rem;
  }
}
</style>
