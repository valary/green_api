import { Navigate } from 'react-router-dom';
import { selectSession } from '../../app/store/selectors';
import { ChatSidebar } from '../../components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import { ConnectionBanners } from '../../components/ConnectionBanners/ConnectionBanners';
import { useAppSelector } from '../../hooks/redux';
import { useActiveChat } from '../../hooks/useActiveChat';
import { useLogoutFromOtherTabs } from '../../hooks/useLogoutFromOtherTabs';
import { useNotificationPolling } from '../../hooks/useNotificationPolling';
import { ChatLayout } from './ChatPage.styles';

export const ChatPage = () => {
    const session = useAppSelector(selectSession);
    const { chatId, unknownChat } = useActiveChat();
    useNotificationPolling(session?.idInstance);
    useLogoutFromOtherTabs();

    if (unknownChat) return <Navigate to="/chat" replace />;

    return (
        <ChatLayout $chatOpen={Boolean(chatId)}>
            <ConnectionBanners />
            <ChatSidebar activeChatId={chatId} />
            <ChatWindow chatId={chatId} />
        </ChatLayout>
    );
};
