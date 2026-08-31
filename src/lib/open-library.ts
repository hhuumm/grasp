export const OPEN_LIBRARY_SEARCH_LIMIT = 12

export type OpenLibraryBook = {
  key: string
  title: string
  authors: string[]
  firstPublishYear?: number
  editionCount?: number
  coverUrl?: string
  openLibraryUrl: string
}

type OpenLibraryDocument = {
  key?: unknown
  title?: unknown
  author_name?: unknown
  first_publish_year?: unknown
  edition_count?: unknown
  cover_i?: unknown
}

export function normalizeBookQuery(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidBookQuery(value: string): boolean {
  return value.length >= 2 && value.length <= 100
}

export function buildOpenLibrarySearchUrl(query: string): string {
  const params = new URLSearchParams({
    q: query,
    fields: 'key,title,author_name,first_publish_year,edition_count,cover_i',
    limit: String(OPEN_LIBRARY_SEARCH_LIMIT),
    page: '1',
  })

  return `https://openlibrary.org/search.json?${params.toString()}`
}

export function mapOpenLibraryDocument(document: OpenLibraryDocument): OpenLibraryBook | null {
  if (typeof document.key !== 'string' || !document.key.startsWith('/works/')) {
    return null
  }

  if (typeof document.title !== 'string' || !document.title.trim()) {
    return null
  }

  const authors = Array.isArray(document.author_name)
    ? document.author_name.filter((author): author is string => typeof author === 'string').slice(0, 3)
    : []
  const coverId = typeof document.cover_i === 'number' ? document.cover_i : undefined

  return {
    key: document.key,
    title: document.title.trim(),
    authors,
    firstPublishYear: typeof document.first_publish_year === 'number' ? document.first_publish_year : undefined,
    editionCount: typeof document.edition_count === 'number' ? document.edition_count : undefined,
    coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
    openLibraryUrl: `https://openlibrary.org${document.key}`,
  }
}

