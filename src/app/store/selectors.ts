import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { Message } from '@/types/message';

const noMessages: Message[] = [];

export const selectSession = (state: RootState) => state.session.current;
export const selectIsDemo = (state: RootState) => state.session.current?.mode === 'demo';
export const selectConnection = (state: RootState) => state.connection;

export const selectChats = (state: RootState) => state.chat.chats;
export const selectAllMessages = (state: RootState) => state.chat.messages;

export const selectChat = (state: RootState, chatId: string | undefined) =>
    chatId ? state.chat.chats[chatId] : undefined;

export const selectMessages = (state: RootState, chatId: string) => state.chat.messages[chatId] ?? noMessages;

export const selectMessage = (state: RootState, chatId: string, localId: string) =>
    state.chat.messages[chatId]?.find((message) => message.localId === localId);

export const selectChatByPhone = (state: RootState, phone: string) =>
    Object.values(state.chat.chats).find((chat) => chat.phone === phone);

export const selectChatPreviews = createSelector([selectChats, selectAllMessages], (chats, messages) =>
    Object.values(chats)
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
        .map((chat) => ({ chat, lastMessage: messages[chat.chatId]?.at(-1) })),
);
