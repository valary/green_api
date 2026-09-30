import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { chatActions } from '@/app/store/slices/chat/chatSlice';
import { selectChat, selectSession } from '@/app/store/selectors';
import { useLogoutFromOtherTabs } from '@/hooks/useLogoutFromOtherTabs';
import { useNotificationPolling } from '@/hooks/useNotificationPolling';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { ChatSidebar } from '@/components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '@/components/ChatWindow/ChatWindow';
import { ConnectionBanners } from '@/components/ConnectionBanners/ConnectionBanners';
import * as S from './ChatPage.styles';

export function ChatPage() {
    const { chatId } = useParams();
    const dispatch = useAppDispatch();
    const chatExists = useAppSelector((state) => Boolean(selectChat(state, chatId)));
    const session = useAppSelector(selectSession);

    useNotificationPolling(session?.idInstance);
    useLogoutFromOtherTabs();

    useEffect(() => {
        if (!chatId || !chatExists) return;
        dispatch(chatActions.chatOpened(chatId));
        return () => {
            dispatch(chatActions.chatClosed());
        };
    }, [chatId, chatExists, dispatch]);

    if (chatId && !chatExists) return <Navigate to="/chat" replace />;

    return (
        <S.Layout $chatOpen={Boolean(chatId)}>
            <ConnectionBanners />
            <ChatSidebar activeChatId={chatId} />
            <ChatWindow chatId={chatId} />
        </S.Layout>
    );
}
