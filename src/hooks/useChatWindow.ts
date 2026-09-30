import { selectChat, selectMessages } from '../app/store/selectors';
import { retryMessage } from '../app/store/slices/chat/thunks';
import { useAppDispatch, useAppSelector } from './redux';

export const useChatWindow = (chatId: string | undefined) => {
    const dispatch = useAppDispatch();
    const chat = useAppSelector((state) => selectChat(state, chatId));
    const messages = useAppSelector((state) => selectMessages(state, chatId ?? ''));

    const retry = (localId: string) => {
        if (chat) void dispatch(retryMessage({ chatId: chat.chatId, localId }));
    };

    return { chat, messages, retry };
};
