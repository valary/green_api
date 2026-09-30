import { messageFailed, messageQueued, messageRetried, messageSent, selectMessage } from '@/entities/chat';
import { fatalErrorOccurred } from '@/entities/session';
import { greenApi, isFatal, toApiError, type ApiError } from '@/shared/api';
import { createAppAsyncThunk } from '@/shared/lib/redux';
import type { AppDispatch } from '@/app/store';

interface Outgoing {
    chatId: string;
    localId: string;
    text: string;
}

const failureReason = (error: ApiError) => {
    if (error.kind === 'network') return 'нет связи';
    if (error.kind === 'server') return 'сервер GREEN-API временно недоступен';
    return error.message;
};

async function deliver({ chatId, localId, text }: Outgoing, dispatch: AppDispatch) {
    try {
        const { idMessage } = await greenApi.sendMessage(chatId, text);
        dispatch(messageSent({ chatId, localId, idMessage }));
        return null;
    } catch (e) {
        const error = toApiError(e);
        if (error.kind === 'aborted') return null;
        dispatch(messageFailed({ chatId, localId, reason: failureReason(error) }));
        if (isFatal(error)) dispatch(fatalErrorOccurred(error.message));
        return error;
    }
}

// Отправляем только по chatId из checkAccount: номер@c.us у Telegram-инстанса съедает квоту дважды.
export const sendMessage = createAppAsyncThunk(
    'sendMessage/send',
    async ({ chatId, text }: { chatId: string; text: string }, { dispatch, rejectWithValue }) => {
        const localId = `local-${crypto.randomUUID()}`;
        dispatch(messageQueued({ chatId, localId, text, timestamp: Date.now() }));
        const error = await deliver({ chatId, localId, text }, dispatch);
        if (error) return rejectWithValue(error);
    },
);

export const retryMessage = createAppAsyncThunk(
    'sendMessage/retry',
    async (
        { chatId, localId }: { chatId: string; localId: string },
        { dispatch, getState, rejectWithValue },
    ) => {
        const message = selectMessage(getState(), chatId, localId);
        if (message?.status !== 'error') return;
        dispatch(messageRetried({ chatId, localId }));
        const error = await deliver({ chatId, localId, text: message.text }, dispatch);
        if (error) return rejectWithValue(error);
    },
);
