import type { ChatState } from './types'

export const initialChats: ChatState = {
  chats: {},
  messages: {},
  activeChatId: null,
  pendingStatuses: {},
}
