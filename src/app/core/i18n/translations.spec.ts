import { describe, expect, it } from 'vitest'
import { de } from './translations.de'
import { en } from './translations.en'

describe('translations', () => {
  it('provides the same translation keys for every language', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort())
  })
})
