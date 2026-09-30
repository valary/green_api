import { expect, it } from 'vitest'
import { settingsWarning } from './settingsWarning'

const good = { webhookUrl: '', incomingWebhook: 'yes', outgoingWebhook: 'yes' }

it('при правильных настройках молчит', () => {
  expect(settingsWarning(good)).toBeNull()
})

it('подсказывает, что поменять, если входящие не придут', () => {
  expect(settingsWarning({ ...good, webhookUrl: 'https://example.com/hook', incomingWebhook: 'no' })).toBe(
    'Входящие сообщения не будут приходить: в настройках инстанса очистите webhookUrl и включите incomingWebhook. Изменения применяются до 5 минут.',
  )
})

it('отдельно предупреждает про статусы ✓✓', () => {
  expect(settingsWarning({ ...good, outgoingWebhook: 'no' })).toContain('включите outgoingWebhook')
})
