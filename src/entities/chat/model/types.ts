import type { Message } from '@/entities/message'

export interface Chat {
  chatId: string
  title: string
  phone?: string
  unread: number
  lastMessageAt: number
}

export type DeliveryStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'noAccount'

export interface DeliveryUpdate {
  chatId: string
  idMessage: string
  status: DeliveryStatus
  description?: string
}

export interface IncomingMessage {
  chatId: string
  idMessage: string
  text: string
  timestamp: number
  senderName: string
}

export type OutgoingEcho = Omit<IncomingMessage, 'senderName'>

export interface ChatState {
  chats: Record<string, Chat>
  messages: Record<string, Message[]>
  activeChatId: string | null
  // Статусы, которые обогнали ответ sendMessage: применяем, когда узнаем idMessage.
  pendingStatuses: Record<string, DeliveryUpdate>
}

export type PersistedChats = Pick<ChatState, 'chats' | 'messages'>
