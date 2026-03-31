const DEFAULT_LEGAL_EMAIL_LOCAL_PART = 'gamehub'
const LEGAL_EMAIL_DOMAIN = 'steinente.de'

export function getLegalEmailAddress(game: string | null): string {
  const normalizedGame = game
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '')
    .slice(0, 64)

  const localPart = normalizedGame || DEFAULT_LEGAL_EMAIL_LOCAL_PART

  return `${localPart}@${LEGAL_EMAIL_DOMAIN}`
}
