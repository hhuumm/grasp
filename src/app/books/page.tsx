'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { BookMarked, BookOpen, ExternalLink, Search } from 'lucide-react'
import { Layout } from '@/components/layout/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { OpenLibraryBook } from '@/lib/open-library'

type SearchResponse = {
  books?: OpenLibraryBook[]
  error?: string
}

export default function BooksPage() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<OpenLibraryBook[]>([])
  const [selectedBook, setSelectedBook] = useState<OpenLibraryBook | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
      const payload = await response.json() as SearchResponse

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to search for books.')
      }

      setBooks(payload.books ?? [])
    } catch (searchError) {
      setBooks([])
      setError(searchError instanceof Error ? searchError.message : 'Unable to search for books.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (book: OpenLibraryBook) => {
    localStorage.setItem('grasp:selected-book', JSON.stringify(book))
    setSelectedBook(book)
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-8 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <BookMarked className="size-8" />
            <div>
              <h1 className="text-3xl font-bold">Find your next book</h1>
              <p className="mt-2 text-white/90">
                Search the Open Library catalog, then save a title as context for your next comprehension session.
              </p>
            </div>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Book discovery</CardTitle>
            <CardDescription>Search by title, author, ISBN, or topic.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. The Left Hand of Darkness"
                minLength={2}
                maxLength={100}
                required
                aria-label="Search books"
              />
              <Button type="submit" disabled={isLoading} className="shrink-0">
                <Search className="size-4" />
                {isLoading ? 'Searching…' : 'Search books'}
              </Button>
            </form>
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          </CardContent>
        </Card>

        {selectedBook && (
          <Card className="border-2 border-[var(--primary)]">
            <CardHeader>
              <Badge color="success" className="w-fit">Selected for training</Badge>
              <CardTitle>{selectedBook.title}</CardTitle>
              <CardDescription>{selectedBook.authors.join(', ') || 'Unknown author'}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/demo"><Button>Continue to practice</Button></Link>
              <a href={selectedBook.openLibraryUrl} target="_blank" rel="noreferrer">
                <Button outline>View catalog record <ExternalLink className="size-4" /></Button>
              </a>
            </CardContent>
          </Card>
        )}

        {books.length > 0 && (
          <section aria-live="polite">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Search results</h2>
                <p className="text-sm text-gray-600">Catalog metadata supplied by Open Library.</p>
              </div>
              <Badge color="zinc">{books.length} shown</Badge>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <Card key={book.key} className="flex h-full flex-col">
                  <CardHeader>
                    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
                      <BookOpen className="size-6 text-[var(--primary)]" />
                    </div>
                    <CardTitle>{book.title}</CardTitle>
                    <CardDescription>{book.authors.join(', ') || 'Unknown author'}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {book.firstPublishYear && <Badge color="zinc">First published {book.firstPublishYear}</Badge>}
                      {book.editionCount && <Badge color="zinc">{book.editionCount} editions</Badge>}
                    </div>
                    <Button onClick={() => handleSelect(book)} className="w-full">Choose for training</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <p className="text-sm text-gray-600">
          Grasp uses Open Library for discovery metadata only. Selecting a book does not provide or copy its text;
          read through a lawful source, then use Grasp’s practice passages and recall workflow.
        </p>
      </div>
    </Layout>
  )
}

