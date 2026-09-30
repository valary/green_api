import type { Message } from '@/entities/message'
import { applyDelivery, raiseStatus } from '../lib/deliveryStatus'
import type { ChatState } from './types'

const MAX_PENDING_STATUSES = 100

export const findByLocalId = (state: ChatState, chatId: string, localId: string) =>
  state.messages[chatId]?.find((message) => message.localId === localId)

export function addMessage(state: ChatState, message: Message) {
  ;(state.messages[message.chatId] ??= []).push(message)
  const chat = state.chats[message.chatId]
  if (chat) chat.lastMessageAt = Math.max(chat.lastMessageAt, message.timestamp)
}

export function attachIdMessage(state: ChatState, message: Message, idMessage: string) {
  // Эхо с тем же текстом могло прилипнуть к соседнему сообщению — отдаём id настоящему владельцу.
  for (const other of state.messages[message.chatId]) {
    if (other !== message && other.idMessage === idMessage) {
      other.idMessage = undefined
      other.status = 'sending'
    }
  }
  message.idMessage = idMessage
  message.error = undefined
  raiseStatus(message, 'sent')

  const pending = state.pendingStatuses[idMessage]
  if (pending) {
    applyDelivery(message, pending)
    delete state.pendingStatuses[idMessage]
  }
}

export function rememberStatus(
  state: ChatState,
  idMessage: string,
  update: ChatState['pendingStatuses'][string],
) {
  state.pendingStatuses[idMessage] = update
  const ids = Object.keys(state.pendingStatuses)
  if (ids.length > MAX_PENDING_STATUSES) delete state.pendingStatuses[ids[0]]
}
