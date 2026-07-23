<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Book } from '../composables/useSeriesData'

const props = defineProps<{
  book: Book
}>()

const { t, locale } = useI18n()

const bookTitle = computed(() => t(`books.${props.book.slug}.title`))
const bookSubtitle = computed(() => t(`books.${props.book.slug}.subtitle`))

// Cover selection per current i18n locale, fallback к cover_v1 (RU) OR placeholder.
// Supports 4 langs: ru / en / de / pt (Иви S138 pack).
const coverSrc = computed(() => {
  const currentLocale = locale.value as 'ru' | 'en' | 'de' | 'pt'
  return (
    props.book.covers?.[currentLocale] ||
    props.book.covers?.ru ||
    props.book.cover_v1 ||
    null
  )
})

const statusLabel = computed(() => {
  switch (props.book.status) {
    case 'live':
      return t('portal.read_book')
    case 'launch_target':
      return t('portal.coming_soon')
    case 'launch_preparing':
      return t('portal.coming_soon')
    case 'stub':
      return t('portal.coming_soon')
    case 'variant_b_pause':
      return t('portal.in_pause')
    case 'svod_zakryt_pre_shit_v5':
      // Иве S170 canon 2026-07-07: свод закрыт S158-S159, лейбл «В паузе»
      // устарел. Теперь как остальные stub — «Скоро». isDisabled сохранено
      // (не роутится до release-signal Андрея).
      return t('portal.coming_soon')
    default:
      return ''
  }
})

const isDisabled = computed(
  () =>
    props.book.status === 'variant_b_pause' ||
    props.book.status === 'svod_zakryt_pre_shit_v5'
)
</script>

<template>
  <article
    class="book-card"
    :class="[`book-card--${book.status}`]"
    :aria-labelledby="`book-${book.slug}-title`"
  >
    <RouterLink
      :to="`/${book.slug}`"
      class="book-card__link"
      :class="{ 'book-card__link--disabled': isDisabled }"
      :aria-disabled="isDisabled"
    >
      <div class="book-card__cover">
        <img
          v-if="coverSrc"
          :src="coverSrc"
          :alt="`Обложка книги ${bookTitle}`"
          width="240"
          height="360"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="book-card__cover-placeholder">
          {{ book.slug }}
        </div>
      </div>

      <div class="book-card__meta">
        <h2 :id="`book-${book.slug}-title`" class="book-card__title">
          {{ bookTitle }}
        </h2>
        <p class="book-card__subtitle">{{ bookSubtitle }}</p>
        <span class="book-card__status">{{ statusLabel }}</span>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.book-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.book-card--live {
  border-color: var(--color-primary);
}

.book-card--variant_b_pause,
.book-card--svod_zakryt_pre_shit_v5 {
  opacity: 0.6;
  font-style: italic;
}

.book-card__link {
  display: block;
  padding: var(--spacing-md);
  color: inherit;
  text-decoration: none;
}

.book-card__link--disabled {
  pointer-events: none;
  cursor: not-allowed;
}

.book-card__cover {
  aspect-ratio: 2/3;
  margin-bottom: var(--spacing-md);
  background: var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.book-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-card__cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  color: var(--color-text-muted);
}

.book-card__title {
  font-size: var(--fs-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.book-card__subtitle {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.book-card__status {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-amber);
  color: #1a1a1a;
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: 500;
}
</style>
