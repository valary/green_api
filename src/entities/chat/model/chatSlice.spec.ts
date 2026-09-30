import { describe, expect, it } from 'vitest'
import { selectChatPreviews } from './chatSelectors'
import {
  chatCreated,
  chatOpened,
  chatSlice,
  deliveryStatusReceived,
  incomingMessageReceived,
  messageFailed,
  messageQueued,
  messageSent,
  outgoingEchoReceived,
} from './chatSlice'
import { initialChats } from './initialChats'
import type { ChatState } from './types'

const reduce = (...actions: Parameters<typeof chatSlice.reducer>[1][]) =>
  actions.reduce<ChatState>(chatSlice.reducer, initialChats)

const chatId = '10000000'
const opened = [
  chatCreated({ chatId, title: '+7 900 123-45-67', phone: '79001234567', createdAt: 1 }),
  chatOpened(chatId),
]
const queued = messageQueued({ chatId, localId: 'local-1', text: 'Привет', timestamp: 2 })
const incoming = { chatId, idMessage: 'in-1', text: 'Ответ', timestamp: 3, senderName: 'Иван' }

describe('chatSlice', () => {
  it('не создаёт второй чат с тем же chatId', () => {
    const state = reduce(
      ...opened,
      chatCreated({ chatId, title: 'другое имя', phone: '79001234567', createdAt: 5 }),
    )

    expect(Object.keys(state.chats)).toEqual([chatId])
    expect(state.chats[chatId].title).toBe('+7 900 123-45-67')
  })

  it('повторное уведомление с тем же idMessage показывается один раз', () => {
    const state = reduce(...opened, incomingMessageReceived(incoming), incomingMessageReceived(incoming))

    expect(state.messages[chatId]).toHaveLength(1)
  })

  it('эхо раньше ответа sendMessage склеивается с отправленным сообщением', () => {
    const state = reduce(
      ...opened,
      queued,
      outgoingEchoReceived({ chatId, idMessage: 'out-1', text: 'Привет', timestamp: 2 }),
      messageSent({ chatId, localId: 'local-1', idMessage: 'out-1' }),
    )

    expect(state.messages[chatId]).toEqual([expect.objectContaining({ idMessage: 'out-1', status: 'sent' })])
  })

  it('статус, пришедший раньше idMessage, применяется после ответа', () => {
    const state = reduce(
      ...opened,
      queued,
      deliveryStatusReceived({ chatId, idMessage: 'out-1', status: 'read' }),
      messageSent({ chatId, localId: 'local-1', idMessage: 'out-1' }),
    )

    expect(state.messages[chatId][0].status).toBe('read')
    expect(state.pendingStatuses).toEqual({})
  })

  it('статус не откатывается назад, а failed превращается в ошибку с причиной', () => {
    const sent = [...opened, queued, messageSent({ chatId, localId: 'local-1', idMessage: 'out-1' })]
    const read = reduce(
      ...sent,
      deliveryStatusReceived({ chatId, idMessage: 'out-1', status: 'read' }),
      deliveryStatusReceived({ chatId, idMessage: 'out-1', status: 'delivered' }),
    )
    const failed = reduce(
      ...sent,
      deliveryStatusReceived({
        chatId,
        idMessage: 'out-1',
        status: 'failed',
        description: 'chatId unresolvable',
      }),
    )

    expect(read.messages[chatId][0].status).toBe('read')
    expect(failed.messages[chatId][0]).toMatchObject({ status: 'error', error: 'chatId unresolvable' })
  })

  it('ошибка отправки не затирает сообщение, которое уже подтвердило эхо', () => {
    const state = reduce(
      ...opened,
      queued,
      outgoingEchoReceived({ chatId, idMessage: 'out-1', text: 'Привет', timestamp: 2 }),
      messageFailed({ chatId, localId: 'local-1', reason: 'нет связи' }),
    )

    expect(state.messages[chatId][0].status).toBe('sent')
  })

  it('входящее от незнакомого chatId создаёт чат со счётчиком непрочитанных', () => {
    const state = reduce(...opened, incomingMessageReceived({ ...incoming, chatId: '20000000' }))

    expect(state.chats['20000000']).toMatchObject({ title: 'Иван', unread: 1 })
    expect(state.chats[chatId].unread).toBe(0)

    const afterOpen = chatSlice.reducer(state, chatOpened('20000000'))
    expect(afterOpen.chats['20000000'].unread).toBe(0)
  })

  it('в списке сверху чат с последним сообщением', () => {
    const state = reduce(
      ...opened,
      incomingMessageReceived({ ...incoming, chatId: '20000000', timestamp: 10 }),
    )
    const previews = selectChatPreviews({ chat: state })

    expect(previews.map((p) => p.chat.chatId)).toEqual(['20000000', chatId])
    expect(previews[0].lastMessage?.text).toBe('Ответ')
  })
})
