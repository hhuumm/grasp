import { NextRequest, NextResponse } from 'next/server'
import {
  buildOpenLibrarySearchUrl,
  isValidBookQuery,
  mapOpenLibraryDocument,
  normalizeBookQuery,
} from '@/lib/open-library'

type OpenLibrarySearchResponse = {
  numFound?: unknown
  docs?: unknown
}

export async function GET(request: NextRequest) {
  const query = normalizeBookQuery(request.nextUrl.searchParams.get('q') ?? '')

  if (!isValidBookQuery(query)) {
    return NextResponse.json(
      { error: 'Search terms must be between 2 and 100 characters.' },
      { status: 400 }
    )
  }

  const contactEmail = process.env.OPEN_LIBRARY_CONTACT_EMAIL?.trim()
  if (!contactEmail) {
    return NextResponse.json(
      { error: 'Book discovery is not configured.' },
      { status: 503 }
    )
  }

  try {
    const response = await fetch(buildOpenLibrarySearchUrl(query), {
      headers: {
        Accept: 'application/json',
        'User-Agent': `Grasp/0.1 (${contactEmail})`,
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Book discovery is temporarily unavailable.' },
        { status: 502 }
      )
    }

    const payload = await response.json() as OpenLibrarySearchResponse
    const documents = Array.isArray(payload.docs) ? payload.docs : []
    const books = documents
      .map((document) => mapOpenLibraryDocument(document as Record<string, unknown>))
      .filter((book) => book !== null)

    return NextResponse.json(
      {
        books,
        total: typeof payload.numFound === 'number' ? payload.numFound : books.length,
        source: 'Open Library',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: 'Book discovery is temporarily unavailable.' },
      { status: 502 }
    )
  }
}

