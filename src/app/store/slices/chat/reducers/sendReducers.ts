import type { PayloadAction } from '@reduxjs/toolkit';
import { addMessage, attachIdMessage, findByLocalId } from '../messageHelpers';
import type { ChatState } from '../../../../../types/chat';

type MessageRef = { chatId: string; localId: string };

export const sendReducers = {
    messageQueued(
        state: ChatState,
        { payload }: PayloadAction<MessageRef & { text: string; timestamp: number }>,
    ) {
        addMessage(state, { ...payload, direction: 'out', status: 'sending' });
    },

    messageRetried(state: ChatState, { payload }: PayloadAction<MessageRef>) {
        const message = findByLocalId(state, payload.chatId, payload.localId);
        if (!message) return;
        message.status = 'sending';
        message.error = undefined;
    },

    messageSent(state: ChatState, { payload }: PayloadAction<MessageRef & { idMessage: string }>) {
        const message = findByLocalId(state, payload.chatId, payload.localId);
        if (message) attachIdMessage(state, message, payload.idMessage);
    },

    messageFailed(state: ChatState, { payload }: PayloadAction<MessageRef & { reason: string }>) {
        const message = findByLocalId(state, payload.chatId, payload.localId);
        if (!message || message.idMessage) return;
        message.status = 'error';
        message.error = payload.reason;
    },
};
