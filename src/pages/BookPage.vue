<script setup lang="ts">
/**
 * Shared BookPage component — используется каждой per-book page (kn1-kn7).
 * Renders book landing с cover + description + status + Schema.org markup.
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useSeriesData, type Locale } from '../composables/useSeriesData'
import { useBookSchema } from '../composables/useSchemaOrg'

// Long-form «Про что книга» annotations — per book, per locale (RU first).
// Iskra canon v3-BEZ-SCHYOTA (S198 виза Andrey) — «файл на скачивание = та же информация что и на сайте».
// Eager glob import: Vite bundles all matched files. Other books/locales add as они canonized.
const proChtoModules = import.meta.glob<string>(
  '../../content/kn*/ru/pro-chto.md',
  { query: '?raw', import: 'default', eager: true },
)

const props = defineProps<{
  slug: string
}>()

const { t } = useI18n()
const { series, bookBySlug } = useSeriesData()

const book = computed(() => bookBySlug(props.slug))
const title = computed(() => t(`books.${props.slug}.title`))
const subtitle = computed(() => t(`books.${props.slug}.subtitle`))

// Canon v2 Iskra S214 §2+§4: витрина несёт принадлежность («Серия „Своим умом" · трилогия „X"»),
// не счёт («Книга N» упразднена). Trilogy name resolved через series.trilogies map.
const trilogyName = computed<string | null>(() => {
  const key = book.value?.trilogy
  if (!key) return null
  return series.value.trilogies?.[key]?.name ?? null
})

// Iskra S217 pair-review defect cont+23 2026-07-26: escape HTML + render **bold** к <strong>.
// Trusted content (Iskra + Andrey authored, mounted at build time); escapeHtml — защита от future edits.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function renderProChtoMarkdown(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
}

// Long-form annotation body (paragraphs) — strip HTML comments + headings + render bold markdown.
const proChtoParagraphs = computed<string[]>(() => {
  const path = `../../content/${props.slug}/ru/pro-chto.md`
  const raw = proChtoModules[path]
  if (!raw) return []
  return raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('<!--') && !p.startsWith('#'))
    .map(renderProChtoMarkdown)
})

const hasProChto = computed(() => proChtoParagraphs.value.length > 0)

const isLive = computed(() => book.value?.status === 'live')

// Books with online reader — extend when more books get readers.
// kn.1 restored cont+30 (agile-sapiens multi-file → portal). kn.3 added same session
// (MASTER.md monolithic → chapters-generated split via kn3-reader-manifest prebuild).
// kn.5 held back cont+31 per Iskra AKT-PRIEMKI S230 §1 P1-4: apparat consolidation
// не диспатчена, книга ещё не издана. Директива Андрея: если книги нет а «Читать»
// есть — ошибка. Restore после Batch B (kn.5 v1.0 build + Iskra PASS).
const READER_ENABLED_BOOKS = ['kn1', 'kn3', 'kn4']
const hasReader = computed(() => READER_ENABLED_BOOKS.includes(props.slug) && isLive.value)
const isPause = computed(() => book.value?.status === 'variant_b_pause')

// Language positions per Iskra ZAGLUSHKI canon S179 — order fixed (RU first, then DE/EN/PT echelon)
const LANGUAGE_ORDER: Locale[] = ['ru', 'de', 'en', 'pt']

const translationEntries = computed(() =>
  LANGUAGE_ORDER.map((lang) => ({
    lang,
    status: book.value?.translations?.[lang] ?? 'preparing',
  }))
)

const hasAnyPreparing = computed(() =>
  translationEntries.value.some((entry) => entry.status === 'preparing')
)

const SITE_URL = 'https://books.folkup.life'

// Per-book og:image — PNG version для соцсетей (Iskra STOP-MAYAK S219 §2д:
// «соцсети капризны к SVG, превью отдавать растровым»). Wave 2 PNG variants
// живут рядом с SVG (cover_knN.png). SVG остаётся для страничного рендера.
const bookOgImage = computed(() => {
  const coverPath = book.value?.cover_v1 || '/covers/cover_kn1.svg'
  const pngPath = coverPath.replace(/\.svg$/, '.png')
  return pngPath.startsWith('http') ? pngPath : `${SITE_URL}${pngPath}`
})

useHead({
  title: () => title.value + ' — ' + t('brand.name'),
  meta: [
    { name: 'description', content: () => subtitle.value },
    { property: 'og:title', content: () => title.value },
    { property: 'og:description', content: () => subtitle.value },
    { property: 'og:type', content: 'book' },
    { property: 'og:image', content: () => bookOgImage.value },
    // Twitter Card override (per-book image)
    { name: 'twitter:title', content: () => title.value },
    { name: 'twitter:description', content: () => subtitle.value },
    { name: 'twitter:image', content: () => bookOgImage.value },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://books.folkup.life/${props.slug}/`,
    },
  ],
})

// Book Schema.org markup
if (book.value) {
  useBookSchema(book.value, series.value, title.value)
}
</script>

<template>
  <div v-if="book" class="book-page">
    <div class="book-page__layout">
      <aside class="book-page__cover">
        <img
          v-if="book.cover_v1"
          :src="book.cover_v1"
          :alt="`Обложка книги ${title}`"
          width="360"
          height="540"
          loading="eager"
        />
      </aside>

      <article class="book-page__content">
        <p class="book-page__series">
          <RouterLink to="/">{{ t('brand.name') }}</RouterLink>
          &middot; Серия «{{ series.name }}»<template v-if="trilogyName">&nbsp;&middot; трилогия «{{ trilogyName }}»</template>
        </p>

        <h1 class="book-page__title">{{ title }}</h1>
        <p class="book-page__subtitle">{{ subtitle }}</p>

        <!--
          «Про что книга» — canonical annotation body per Iskra S198 v3-BEZ-SCHYOTA (виза Андрея).
          Rendered only if content/kn{N}/ru/pro-chto.md exists (currently kn1).
          Rule «файл на скачивание = та же информация что и на сайте» — S197 canon.
        -->
        <section
          v-if="hasProChto"
          class="book-page__pro-chto"
          :aria-label="'Про что книга «' + title + '»'"
        >
          <h2 class="book-page__pro-chto-heading">Про что книга</h2>
          <p
            v-for="(para, index) in proChtoParagraphs"
            :key="index"
            class="book-page__pro-chto-paragraph"
            v-html="para"
          ></p>
        </section>

        <div v-if="isLive" class="book-page__actions">
          <RouterLink
            v-if="hasReader"
            :to="`/${props.slug}/read`"
            class="book-page__button book-page__button--primary"
          >
            Читать онлайн
          </RouterLink>
          <a
            v-if="book.downloads?.epub"
            :href="book.downloads.epub"
            class="book-page__button"
            download
          >
            {{ t('portal.download_epub') }}
          </a>
          <a
            v-if="book.downloads?.pdf"
            :href="book.downloads.pdf"
            class="book-page__button"
            download
          >
            {{ t('portal.download_pdf') }}
          </a>
        </div>

        <div
          v-if="isLive && book.format_stale_note"
          class="book-page__format-stale"
          role="note"
          aria-label="Пометка о форматах на реставрации"
        >
          <strong>Форматы на реставрации.</strong>
          <p>{{ book.format_stale_note }}</p>
        </div>

        <div v-else-if="isPause" class="book-page__notice">
          <strong>{{ t('portal.in_pause') }}.</strong>
          <p>{{ subtitle }}</p>
        </div>

        <div v-else class="book-page__notice">
          <strong>{{ t('portal.coming_soon') }}</strong>
        </div>

        <!--
          Языковые версии — Iskra canon ZAGLUSHKI S179 (виза Андрея 2026-07-18).
          Регистр музейный, рифма со штампом «ЭКСПОНАТ НА РЕСТАВРАЦИИ» (S138).
          Правило «перевод не блокирует релиз» — RU не ждёт остальные.
        -->
        <section
          v-if="book.translations"
          class="book-page__translations"
          :aria-label="t('portal.translations_heading')"
        >
          <h2 class="book-page__translations-heading">{{ t('portal.translations_heading') }}</h2>
          <ul class="book-page__translations-list">
            <li
              v-for="entry in translationEntries"
              :key="entry.lang"
              class="book-page__translation-item"
              :class="{
                'book-page__translation-item--live': entry.status === 'live',
                'book-page__translation-item--preparing': entry.status === 'preparing',
              }"
            >
              <span class="book-page__translation-lang">{{ entry.lang.toUpperCase() }}</span>
              <span
                class="book-page__translation-badge"
                :class="{
                  'book-page__translation-badge--live': entry.status === 'live',
                  'book-page__translation-badge--preparing': entry.status === 'preparing',
                }"
              >
                <template v-if="entry.status === 'live'">{{ t('portal.translation_available') }}</template>
                <template v-else>{{ t('portal.translation_stub_short') }}</template>
              </span>
            </li>
          </ul>
          <p v-if="hasAnyPreparing" class="book-page__translation-stub-full">
            {{ t('portal.translation_stub_full') }}
          </p>
        </section>

        <footer class="book-page__meta">
          <p>
            <strong>Автор:</strong> Команданте FolkUp
          </p>
          <p>
            <strong>©</strong> {{ series.author }} ·
            <a :href="series.license_url">{{ series.license }}</a>
          </p>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped>
.book-page {
  padding: var(--spacing-xl) 0;
}

.book-page__layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
}

@media (max-width: 768px) {
  .book-page__layout {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
}

.book-page__cover {
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.book-page__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-page__series {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.book-page__title {
  margin-bottom: var(--spacing-sm);
}

.book-page__subtitle {
  font-size: var(--fs-lg);
  font-style: italic;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
}

/*
  «Про что книга» — long-form annotation section (Iskra canon S198).
  Rendered после subtitle, перед downloads buttons — reader flow: title → tagline → content preview → download.
*/
.book-page__pro-chto {
  margin: 0 0 var(--spacing-2xl);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.book-page__pro-chto-heading {
  font-size: var(--fs-xl);
  margin: 0 0 var(--spacing-md);
  color: var(--color-text);
  /* Iskra P0-ZHIVOY §3 п.2 (2026-07-23): script-шрифт в блоках → serif как тело до дизайн-арки */
  font-family: var(--font-body);
}

.book-page__pro-chto-paragraph {
  margin: 0 0 var(--spacing-md);
  line-height: 1.65;
  color: var(--color-text);
  font-size: var(--fs-md);
}

.book-page__pro-chto-paragraph:last-child {
  margin-bottom: 0;
}

.book-page__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.book-page__format-stale {
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  background: var(--color-ivory, #FEFCF6);
  border: 1px solid var(--color-amber, #E8AD4A);
  border-left: 4px solid var(--color-amber, #E8AD4A);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text, #2b2b2b);
}

.book-page__format-stale strong {
  color: var(--color-bordeaux, #7D4450);
  display: block;
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.02em;
}

.book-page__format-stale p {
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

.book-page__button {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: var(--color-ivory);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 500;
  transition: background var(--transition-fast);
}

.book-page__button:hover {
  background: var(--color-bordeaux);
  color: var(--color-ivory);
}

.book-page__notice {
  padding: var(--spacing-md);
  background: var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xl);
}

/*
  Языковые версии — Iskra canon ZAGLUSHKI S179.
  Регистр музейный, рифма со штампом «ЭКСПОНАТ НА РЕСТАВРАЦИИ».
*/
.book-page__translations {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
}

.book-page__translations-heading {
  font-size: var(--fs-lg);
  margin: 0 0 var(--spacing-md);
  color: var(--color-text);
  /* Iskra P0-ZHIVOY §3 п.2 (2026-07-23): script-шрифт в блоках → serif как тело до дизайн-арки */
  font-family: var(--font-body);
}

.book-page__translations-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.book-page__translation-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  background: var(--color-border);
  font-size: var(--fs-sm);
}

.book-page__translation-lang {
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text);
}

.book-page__translation-badge {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.book-page__translation-badge--live {
  color: var(--color-primary);
  font-style: normal;
  font-weight: 500;
}

.book-page__translation-stub-full {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  font-style: italic;
  line-height: 1.5;
}

.book-page__meta {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.book-page__meta p {
  margin-bottom: var(--spacing-xs);
}
</style>
