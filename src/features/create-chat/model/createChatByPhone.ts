import { chatCreated, selectChatByPhone } from '@/entities/chat';
import { fatalErrorOccurred } from '@/entities/session';
import { greenApi, isFatal, toApiError } from '@/shared/api';
import { formatPhone } from '@/shared/lib/phone';
import { createAppAsyncThunk } from '@/shared/lib/redux';

const NOT_FOUND =
    'Номер не найден в Telegram или скрыт настройками приватности. Попросите получателя добавить ваш номер в контакты';

// Telegram отвечает с числовым chatId, а не с номер@c.us — поэтому чат открываем только через checkAccount.
export const createChatByPhone = createAppAsyncThunk(
    'createChat/byPhone',
    async (phone: string, { dispatch, getState, rejectWithValue }) => {
        const known = selectChatByPhone(getState(), phone);
        if (known) return known.chatId;

        try {
            const { exist, chatId } = await greenApi.checkAccount(Number(phone));
            if (!exist || !chatId) return rejectWithValue({ kind: 'validation', message: NOT_FOUND });

            dispatch(
                chatCreated({
                    chatId: String(chatId),
                    title: formatPhone(phone),
                    phone,
                    createdAt: Date.now(),
                }),
            );
            return String(chatId);
        } catch (e) {
            const error = toApiError(e);
            if (isFatal(error)) dispatch(fatalErrorOccurred(error.message));
            return rejectWithValue(error);
        }
    },
);
