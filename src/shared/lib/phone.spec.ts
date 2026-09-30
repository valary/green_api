import { describe, expect, it } from 'vitest'
import { formatPhone, normalizePhone } from './phone'

describe('normalizePhone', () => {
  it.each([
    ['+7 (900) 123-45-67', '79001234567'],
    ['89001234567', '79001234567'],
    ['+1 212 555 01 23', '12125550123'],
  ])('%s → %s', (input, digits) => {
    expect(normalizePhone(input)).toBe(digits)
  })

  it.each(['12345', '+7 900 123', '1234567890123456', 'abc'])('%s — не номер', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

it('formatPhone показывает российский номер по-человечески', () => {
  expect(formatPhone('79001234567')).toBe('+7 900 123-45-67')
  expect(formatPhone('12125550123')).toBe('+12125550123')
})
