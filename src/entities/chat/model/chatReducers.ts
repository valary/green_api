import type { PayloadAction } from '@reduxjs/toolkit'
import type { ChatState, PersistedChats } from './types'

export const chatReducers = {
  chatCreated(
    state: ChatState,
    { payload }: PayloadAction<{ chatId: string; title: string; phone: string; createdAt: number }>,
  ) {
    const existing = state.chats[payload.chatId]
    if (existing) {
      existing.phone ??= payload.phone
      return
    }
    state.chats[payload.chatId] = {
      chatId: payload.chatId,
      title: payload.title,
      phone: payload.phone,
      unread: 0,
      lastMessageAt: payload.createdAt,
    }
  },

  chatOpened(state: ChatState, { payload: chatId }: PayloadAction<string>) {
    state.activeChatId = chatId
    const chat = state.chats[chatId]
    if (chat) chat.unread = 0
  },

  chatClosed(state: ChatState) {
    state.activeChatId = null
  },

  chatsRestored(state: ChatState, { payload }: PayloadAction<PersistedChats>) {
    state.chats = payload.chats
    state.messages = payload.messages
  },
}
