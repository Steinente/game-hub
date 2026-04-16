import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node'
import express from 'express'
import { join } from 'node:path'

const browserDistFolder = join(import.meta.dirname, '../browser')

type GameSource = {
  id: string
  url: string
  isPrivate?: boolean
}

type GameCardPayload = {
  id: string
  url: string
  name: string
  description: string
  iconUrl: string
  isOnline: boolean
  checkedAt: string
  isPrivate?: boolean
}

const GAME_SOURCES: GameSource[] = [
  {
    id: 'wizard',
    url: 'https://wizard.steinente.de/',
    isPrivate: true,
  },
  {
    id: 'poker',
    url: 'https://poker.steinente.de/',
  },
]

const REQUEST_TIMEOUT_MS = 8_000
const FALLBACK_ICON = '/icons/icon-192x192.png'

const app = express()
const angularApp = new AngularNodeAppEngine()

async function fetchWithTimeout(resource: string, timeoutMs: number) {
  const controller = new AbortController()
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(resource, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'GameHub-Metadata-Bot/1.0',
      },
    })
  } finally {
    clearTimeout(timeoutHandle)
  }
}

function firstMatch(content: string, regex: RegExp): string | null {
  const match = content.match(regex)
  const value = match?.[1]?.trim()
  return value ? value : null
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function extractMetaContent(html: string, property: string): string | null {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const metaRegex = new RegExp(
    `<meta[^>]+(?:name|property)=["']${escapedProperty}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    'i',
  )

  const reverseMetaRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*(?:name|property)=["']${escapedProperty}["'][^>]*>`,
    'i',
  )

  return (
    firstMatch(html, metaRegex) ?? firstMatch(html, reverseMetaRegex) ?? null
  )
}

function extractTitle(html: string): string | null {
  return firstMatch(html, /<title[^>]*>([^<]+)<\/title>/i)
}

function extractIconHref(html: string): string | null {
  const iconRelRegex =
    /<link[^>]+rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i
  const reverseIconRelRegex =
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]*>/i

  return (
    firstMatch(html, iconRelRegex) ??
    firstMatch(html, reverseIconRelRegex) ??
    null
  )
}

function resolveIconUrl(iconHref: string | null, pageUrl: string): string {
  if (!iconHref) {
    return new URL(FALLBACK_ICON, pageUrl).toString()
  }

  try {
    return new URL(iconHref, pageUrl).toString()
  } catch {
    return new URL(FALLBACK_ICON, pageUrl).toString()
  }
}

async function loadGameCardData(source: GameSource): Promise<GameCardPayload> {
  const checkedAt = new Date().toISOString()

  try {
    const response = await fetchWithTimeout(source.url, REQUEST_TIMEOUT_MS)
    const isOnline = response.ok

    if (!isOnline) {
      return {
        id: source.id,
        url: source.url,
        name: source.id,
        description: 'Website is currently unavailable.',
        iconUrl: resolveIconUrl(null, source.url),
        isOnline,
        checkedAt,
        isPrivate: source.isPrivate,
      }
    }

    const html = await response.text()
    const title =
      extractMetaContent(html, 'og:title') ?? extractTitle(html) ?? source.id
    const description =
      extractMetaContent(html, 'description') ??
      extractMetaContent(html, 'og:description') ??
      'No description provided by the target website.'
    const iconHref =
      extractMetaContent(html, 'og:image') ?? extractIconHref(html) ?? null

    return {
      id: source.id,
      url: source.url,
      name: decodeHtmlEntities(title),
      description: decodeHtmlEntities(description),
      iconUrl: resolveIconUrl(iconHref, source.url),
      isOnline,
      checkedAt,
      isPrivate: source.isPrivate,
    }
  } catch {
    return {
      id: source.id,
      url: source.url,
      name: source.id,
      description: 'Website is currently unavailable.',
      iconUrl: resolveIconUrl(null, source.url),
      isOnline: false,
      checkedAt,
      isPrivate: source.isPrivate,
    }
  }
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */
app.get('/api/games', async (_req, res) => {
  const games = await Promise.all(
    GAME_SOURCES.map((source) => loadGameCardData(source)),
  )

  res.setHeader('cache-control', 'no-store')
  res.json(games)
})

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
)

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next)
})

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000
  app.listen(port, (error) => {
    if (error) {
      throw error
    }

    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app)
