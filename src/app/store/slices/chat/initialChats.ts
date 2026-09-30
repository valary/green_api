import type { ChatState } from '../../../../types/chat';

export const initialChats: ChatState = {
    chats: {},
    messages: {},
    activeChatId: null,
    pendingStatuses: {},
};
