import { createSelector } from '@reduxjs/toolkit';
import type { Message } from '@/entities/message';
import type { ChatState } from './types';

type State = { chat: ChatState };

const noMessages: Message[] = [];

export const selectChats = (state: State) => state.chat.chats;
export const selectAllMessages = (state: State) => state.chat.messages;
export const selectActiveChatId = (state: State) => state.chat.activeChatId;

export const selectChat = (state: State, chatId: string | undefined) =>
    chatId ? state.chat.chats[chatId] : undefined;

export const selectMessages = (state: State, chatId: string) => state.chat.messages[chatId] ?? noMessages;

export const selectMessage = (state: State, chatId: string, localId: string) =>
    state.chat.messages[chatId]?.find((message) => message.localId === localId);

export const selectChatByPhone = (state: State, phone: string) =>
    Object.values(state.chat.chats).find((chat) => chat.phone === phone);

export const selectChatPreviews = createSelector([selectChats, selectAllMessages], (chats, messages) =>
    Object.values(chats)
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
        .map((chat) => ({ chat, lastMessage: messages[chat.chatId]?.at(-1) })),
);
