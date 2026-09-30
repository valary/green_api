import type { PayloadAction } from '@reduxjs/toolkit';
import { applyDelivery } from '@/app/store/slices/chat/deliveryStatus';
import { addMessage, attachIdMessage, rememberStatus } from '@/app/store/slices/chat/messageHelpers';
import type { ChatState, DeliveryUpdate, IncomingMessage, OutgoingEcho } from '@/types/chat';

const hasMessage = (state: ChatState, chatId: string, idMessage: string) =>
    state.messages[chatId]?.some((message) => message.idMessage === idMessage) ?? false;

export const notificationReducers = {
    incomingMessageReceived(state: ChatState, { payload }: PayloadAction<IncomingMessage>) {
        const { chatId, idMessage, senderName, ...rest } = payload;
        if (hasMessage(state, chatId, idMessage)) return;

        const chat = (state.chats[chatId] ??= { chatId, title: senderName, unread: 0, lastMessageAt: 0 });
        if (state.activeChatId !== chatId) chat.unread++;
        addMessage(state, { ...rest, chatId, idMessage, localId: idMessage, direction: 'in' });
    },

    outgoingEchoReceived(state: ChatState, { payload }: PayloadAction<OutgoingEcho>) {
        const { chatId, idMessage, text, timestamp } = payload;
        if (hasMessage(state, chatId, idMessage)) return;

        // Эхо обогнало ответ sendMessage (или ответ не дождались по таймауту) — склеиваем по тексту.
        const waiting = state.messages[chatId]?.find(
            (message) =>
                message.direction === 'out' &&
                !message.idMessage &&
                (message.status === 'sending' || message.status === 'error') &&
                message.text === text,
        );
        if (waiting) return attachIdMessage(state, waiting, idMessage);

        // Отправлено через API из другого места: показываем, только если такой чат у нас уже есть.
        if (!state.chats[chatId]) return;
        addMessage(state, {
            chatId,
            idMessage,
            localId: idMessage,
            text,
            timestamp,
            direction: 'out',
            status: 'sent',
        });
    },

    deliveryStatusReceived(state: ChatState, { payload }: PayloadAction<DeliveryUpdate>) {
        const message = state.messages[payload.chatId]?.find((m) => m.idMessage === payload.idMessage);
        if (message) applyDelivery(message, payload);
        else rememberStatus(state, payload.idMessage, payload);
    },
};
