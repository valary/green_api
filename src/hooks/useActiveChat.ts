import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { selectChat } from '../app/store/selectors';
import { chatActions } from '../app/store/slices/chat/chatSlice';
import { useAppDispatch, useAppSelector } from './redux';

// Открытый чат живёт в адресе: /chat/:chatId. Стор узнаёт о нём, чтобы не считать входящие непрочитанными.
export const useActiveChat = () => {
    const { chatId } = useParams();
    const dispatch = useAppDispatch();
    const chatExists = useAppSelector((state) => Boolean(selectChat(state, chatId)));

    useEffect(() => {
        if (!chatId || !chatExists) return;
        dispatch(chatActions.chatOpened(chatId));
        return () => {
            dispatch(chatActions.chatClosed());
        };
    }, [chatId, chatExists, dispatch]);

    return { chatId, unknownChat: Boolean(chatId) && !chatExists };
};
