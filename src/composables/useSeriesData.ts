import { computed } from 'vue'
import yaml from 'js-yaml'
import seriesYamlRaw from '@data/series.yaml?raw'

export interface Book {
  position: number
  slug: string
  slug_en_temp: string
  status: 'live' | 'stub' | 'launch_target' | 'variant_b_pause'
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

  const liveBooks = computed(() => books.value.filter((b) => b.status === 'live'))
  const upcomingBooks = computed(() =>
    books.value.filter((b) => b.status === 'launch_target')
  )
  const stubBooks = computed(() => books.value.filter((b) => b.status === 'stub'))
  const pausedBooks = computed(() =>
    books.value.filter((b) => b.status === 'variant_b_pause')
  )

  return {
    series,
    books,
    bookBySlug,
    liveBooks,
    upcomingBooks,
    stubBooks,
    pausedBooks,
  }
}
