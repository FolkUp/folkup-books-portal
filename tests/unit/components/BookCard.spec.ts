import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import BookCard from '@/components/BookCard.vue'
import ruMessages from '@/i18n/locales/ru.json'
import type { Book } from '@/composables/useSeriesData'

const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: { ru: ruMessages },
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/kn1', component: { template: '<div />' } }],
})

function createBookCard(book: Book) {
  return mount(BookCard, {
    props: { book },
    global: {
      plugins: [i18n, router],
    },
  })
}

const liveBook: Book = {
  position: 1,
  slug: 'kn1',
  slug_en_temp: 'agile-sapiens',
  status: 'live',
  cover_v1: '/covers/cover_kn1_ru.svg',
}

const pausedBook: Book = {
  position: 7,
  slug: 'kn7',
  slug_en_temp: 'lost-in-conversation',
  status: 'variant_b_pause',
  cover_v1: '/covers/cover_kn7_ru.svg',
}

describe('BookCard', () => {
  it('renders book title from i18n', () => {
    const wrapper = createBookCard(liveBook)
    expect(wrapper.text()).toContain('Agile Sapiens')
  })

  it('renders cover image with correct alt text', () => {
    const wrapper = createBookCard(liveBook)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toContain('Agile Sapiens')
    expect(img.attributes('loading')).toBe('lazy')
  })

  it('renders status "Читать" (short) для live book (Iskra §6 VITRINNYY-PAKET S214)', () => {
    // Iskra §6 canonical: короткий лейбл вместо «Читать книгу» для снижения визуального шума.
    const wrapper = createBookCard(liveBook)
    expect(wrapper.find('.book-card__status').text()).toBe('Читать')
  })

  it('renders status "В паузе" для Variant B book', () => {
    const wrapper = createBookCard(pausedBook)
    expect(wrapper.find('.book-card__status').text()).toBe('В паузе')
  })

  it('disables link для Variant B book', () => {
    const wrapper = createBookCard(pausedBook)
    const link = wrapper.find('.book-card__link')
    expect(link.classes()).toContain('book-card__link--disabled')
    expect(link.attributes('aria-disabled')).toBe('true')
  })

  it('applies status modifier class', () => {
    const live = createBookCard(liveBook)
    expect(live.find('.book-card').classes()).toContain('book-card--live')

    const paused = createBookCard(pausedBook)
    expect(paused.find('.book-card').classes()).toContain('book-card--variant_b_pause')
  })

  it('link points к correct book URL', () => {
    const wrapper = createBookCard(liveBook)
    const link = wrapper.find('a.book-card__link')
    expect(link.attributes('href')).toContain('/kn1')
  })

  it('renders semantic article с aria-labelledby', () => {
    const wrapper = createBookCard(liveBook)
    const article = wrapper.find('article')
    expect(article.exists()).toBe(true)
    expect(article.attributes('aria-labelledby')).toBe('book-kn1-title')
  })
})
