import { describe, expect, it } from 'vitest'
import { incomingMessage, outgoingApiMessage, outgoingStatus } from '@/shared/api/mocks/fixtures'
import { parseNotification } from './parseNotification'

describe('parseNotification', () => {
  it('берёт имя из контакта, потом из имени отправителя', () => {
    const body = incomingMessage({
      idMessage: 'in-1',
      chatId: '10000000',
      text: 'Привет',
      senderName: 'Иван',
    })

    expect(parseNotification(body)).toEqual({
      kind: 'incoming',
      message: {
        chatId: '10000000',
        idMessage: 'in-1',
        text: 'Привет',
        timestamp: body.timestamp * 1000,
        senderName: 'Иван',
      },
    })
  })

  it('текст со ссылкой приходит как extendedTextMessage', () => {
    const body = incomingMessage({
      idMessage: 'in-2',
      chatId: '10000000',
      text: 'Документация: https://green-api.com',
    })

    expect(parseNotification(body)).toMatchObject({
      kind: 'incoming',
      message: { text: 'Документация: https://green-api.com' },
    })
  })

  it('эхо своей отправки и статус доставки', () => {
    expect(
      parseNotification(outgoingApiMessage({ idMessage: 'out-1', chatId: '10000000', text: 'Тест' })),
    ).toMatchObject({
      kind: 'echo',
    })
    expect(parseNotification(outgoingStatus('10000000', 'out-1', 'read'))).toEqual({
      kind: 'status',
      update: { chatId: '10000000', idMessage: 'out-1', status: 'read', description: undefined },
    })
  })

  it.each([
    [
      'медиа',
      {
        ...incomingMessage({ idMessage: 'm', chatId: '1', text: '' }),
        messageData: { typeMessage: 'imageMessage' },
      },
    ],
    ['группа', incomingMessage({ idMessage: 'g', chatId: '-100500', text: 'всем привет' })],
    ['мусор', 'not a json object'],
    ['пусто', null],
  ])('%s — пропускаем', (_, body) => {
    expect(parseNotification(body)).toEqual({ kind: 'ignored' })
  })
})
