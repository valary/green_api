import type { ApiError } from '../../../../types/greenApi';
import { chatActions } from './chatSlice';
import { selectChatByPhone, selectMessage } from '../../selectors';
import { connectionActions } from '../connection/connectionSlice';
import { checkAccountApi, sendMessageApi } from '../../../api/requests';
import { isFatal, toApiError } from '../../../api/apiError';
import { formatPhone } from '../../../../shared/utils/phone';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import type { AppDispatch } from '../../store';
import { ERROR_TEXTS, NEW_CHAT_TEXTS } from '../../../../shared/constants/texts';

// Telegram отвечает с числовым chatId, а не с номер@c.us — поэтому чат открываем только через checkAccount.
export const createChatByPhone = createAppAsyncThunk(
    'createChat/byPhone',
    async (phone: string, { dispatch, getState, rejectWithValue }) => {
        const known = selectChatByPhone(getState(), phone);
        if (known) return known.chatId;

        try {
            const { data } = await checkAccountApi(Number(phone));
            const { exist, chatId } = data;
            if (!exist || !chatId)
                return rejectWithValue({ kind: 'validation', message: NEW_CHAT_TEXTS.notFound });

            dispatch(
                chatActions.chatCreated({
                    chatId: String(chatId),
                    title: formatPhone(phone),
                    phone,
                    createdAt: Date.now(),
                }),
            );
            return String(chatId);
        } catch (e) {
            const error = toApiError(e);
            if (isFatal(error)) dispatch(connectionActions.fatalErrorOccurred(error.message));
            return rejectWithValue(error);
        }
    },
);

interface Outgoing {
    chatId: string;
    localId: string;
    text: string;
}

const failureReason = (error: ApiError) => {
    if (error.kind === 'network') return ERROR_TEXTS.sendOffline;
    if (error.kind === 'server') return ERROR_TEXTS.sendServer;
    return error.message;
};

const deliver = async ({ chatId, localId, text }: Outgoing, dispatch: AppDispatch) => {
    try {
        const { data } = await sendMessageApi(chatId, text);
        const { idMessage } = data;
        dispatch(chatActions.messageSent({ chatId, localId, idMessage }));
        return null;
    } catch (e) {
        const error = toApiError(e);
        if (error.kind === 'aborted') return null;
        dispatch(chatActions.messageFailed({ chatId, localId, reason: failureReason(error) }));
        if (isFatal(error)) dispatch(connectionActions.fatalErrorOccurred(error.message));
        return error;
    }
};

// Отправляем только по chatId из checkAccount: номер@c.us у Telegram-инстанса съедает квоту дважды.
export const sendMessage = createAppAsyncThunk(
    'sendMessage/send',
    async ({ chatId, text }: { chatId: string; text: string }, { dispatch, rejectWithValue }) => {
        const localId = `local-${crypto.randomUUID()}`;
        dispatch(chatActions.messageQueued({ chatId, localId, text, timestamp: Date.now() }));
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
        dispatch(chatActions.messageRetried({ chatId, localId }));
        const error = await deliver({ chatId, localId, text: message.text }, dispatch);
        if (error) return rejectWithValue(error);
    },
);
