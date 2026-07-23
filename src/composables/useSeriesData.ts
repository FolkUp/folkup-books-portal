import { computed } from 'vue'
import yaml from 'js-yaml'
import seriesYamlRaw from '@data/series.yaml?raw'

export type TranslationStatus = 'live' | 'preparing'
export type Locale = 'ru' | 'de' | 'en' | 'pt'

// Canon v2 Iskra S214: trilogy keys = svoimi_silami / iz_pervyh_ruk / obshchiy_yazyk
export type TrilogyKey = 'svoimi_silami' | 'iz_pervyh_ruk' | 'obshchiy_yazyk'

export interface Trilogy {
  name: string
  arc: string
  description?: string
}

export interface Book {
  position: number
  slug: string
  slug_en_temp: string
  trilogy?: TrilogyKey
  status: 'live' | 'stub' | 'launch_target' | 'launch_preparing' | 'variant_b_pause' | 'svod_zakryt_pre_shit_v5'
  canonical_pre_cutover?: string
  version?: string
  launch_date?: string
  launch_date_target?: string
  launch_target?: string
  date_relicensed?: string
  downloads?: {
    epub?: string
    pdf?: string
  }
  cover_v1?: string
  covers?: {
    ru?: string
    en?: string
    de?: string
    pt?: string
  }
  translations?: {
    ru?: TranslationStatus
    de?: TranslationStatus
    en?: TranslationStatus
    pt?: TranslationStatus
  }
  illustration_style?: string
  isbn?: string | null
}

export interface SeriesMeta {
  name: string
  author: string
  author_url: string
  license: string
  license_url: string
  total_books: number
  publisher: string
  publisher_imprint: string
  trilogies?: Record<TrilogyKey, Trilogy>
}

interface SeriesData {
  series: SeriesMeta
  books: Book[]
}

// Parse YAML один раз at module load — SSG friendly
const parsed = yaml.load(seriesYamlRaw) as SeriesData

export function useSeriesData() {
  const series = computed(() => parsed.series)
  const books = computed(() => parsed.books)

  const bookBySlug = (slug: string) => books.value.find((b) => b.slug === slug)

  // Iskra §3 VITRINNYY-PAKET S214: книги сгруппированы по трилогиям для главной.
  // Порядок трилогий = порядок в trilogies map (svoimi_silami → iz_pervyh_ruk → obshchiy_yazyk).
  // Внутри трилогии — по position field. Книги без trilogy field попадают в 'other'.
  const booksByTrilogy = computed(() => {
    const trilogies = series.value.trilogies
    if (!trilogies) return []
    const trilogyKeys = Object.keys(trilogies) as TrilogyKey[]
    return trilogyKeys.map((key) => ({
      key,
      trilogy: trilogies[key],
      books: books.value
        .filter((b) => b.trilogy === key)
        .sort((a, b) => a.position - b.position),
    }))
  })

  const liveBooks = computed(() => books.value.filter((b) => b.status === 'live'))
  const upcomingBooks = computed(() =>
    books.value.filter((b) => b.status === 'launch_target' || b.status === 'launch_preparing')
  )
  const stubBooks = computed(() => books.value.filter((b) => b.status === 'stub'))
  // Books waiting for quality gate (ЩИТ v5) before publication.
  // Includes historical variant_b_pause + current svod_zakryt_pre_shit_v5 (Иви S151).
  const gatedBooks = computed(() =>
    books.value.filter(
      (b) =>
        b.status === 'variant_b_pause' ||
        b.status === 'svod_zakryt_pre_shit_v5'
    )
  )

  return {
    series,
    books,
    bookBySlug,
    booksByTrilogy,
    liveBooks,
    upcomingBooks,
    stubBooks,
    gatedBooks,
  }
}
