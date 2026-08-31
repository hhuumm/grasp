import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildOpenLibrarySearchUrl,
  isValidBookQuery,
  mapOpenLibraryDocument,
  normalizeBookQuery,
} from '../src/lib/open-library'

test('normalizes and validates human search terms', () => {
  assert.equal(normalizeBookQuery('  ursula   le guin  '), 'ursula le guin')
  assert.equal(isValidBookQuery('a'), false)
  assert.equal(isValidBookQuery('Dune'), true)
  assert.equal(isValidBookQuery('x'.repeat(101)), false)
})

test('requests only the catalog fields Grasp uses', () => {
  const url = new URL(buildOpenLibrarySearchUrl('A Wizard of Earthsea'))
  assert.equal(url.origin, 'https://openlibrary.org')
  assert.equal(url.pathname, '/search.json')
  assert.equal(url.searchParams.get('q'), 'A Wizard of Earthsea')
  assert.equal(url.searchParams.get('limit'), '12')
  assert.match(url.searchParams.get('fields') ?? '', /title/)
})

test('maps a valid Open Library work into stable app metadata', () => {
  assert.deepEqual(mapOpenLibraryDocument({
    key: '/works/OL45804W',
    title: 'Fantastic Mr. Fox',
    author_name: ['Roald Dahl'],
    first_publish_year: 1970,
    edition_count: 44,
    cover_i: 123,
  }), {
    key: '/works/OL45804W',
    title: 'Fantastic Mr. Fox',
    authors: ['Roald Dahl'],
    firstPublishYear: 1970,
    editionCount: 44,
    coverUrl: 'https://covers.openlibrary.org/b/id/123-M.jpg',
    openLibraryUrl: 'https://openlibrary.org/works/OL45804W',
  })
})

test('rejects malformed or non-work search documents', () => {
  assert.equal(mapOpenLibraryDocument({ key: '/authors/OL1A', title: 'Wrong type' }), null)
  assert.equal(mapOpenLibraryDocument({ key: '/works/OL1W' }), null)
})

