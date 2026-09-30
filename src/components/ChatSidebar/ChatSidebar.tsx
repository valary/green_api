import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectChatPreviews } from '../../app/store/selectors';
import { DemoBadge } from '../DemoBadge/DemoBadge';
import { NewChatDialog } from '../NewChatDialog/NewChatDialog';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { useAppSelector } from '../../hooks/redux';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import {
    SidebarPanel,
    SidebarHeader,
    SidebarTitle,
    HeaderSpacer,
    ChatList,
    NewChatFab,
    EmptyChats,
    EmptyChatsArt,
} from './ChatSidebar.styles';

type Props = { activeChatId?: string };

export const ChatSidebar = ({ activeChatId }: Props) => {
    const navigate = useNavigate();
    const previews = useAppSelector(selectChatPreviews);
    const [dialogOpen, setDialogOpen] = useState(false);

    const openChat = (chatId: string) => navigate(`/chat/${chatId}`);
    const onCreated = (chatId: string) => {
        setDialogOpen(false);
        openChat(chatId);
    };

    return (
        <SidebarPanel aria-label="Чаты">
            <SidebarHeader>
                <SidebarTitle>Чаты</SidebarTitle>
                <DemoBadge />
                <HeaderSpacer />
                <LogoutButton />
            </SidebarHeader>

            {previews.length > 0 ? (
                <>
                    <ChatList>
                        {previews.map(({ chat, lastMessage }) => (
                            <li key={chat.chatId}>
                                <ChatListItem
                                    chat={chat}
                                    lastMessage={lastMessage}
                                    current={chat.chatId === activeChatId}
                                    onOpen={openChat}
                                />
                            </li>
                        ))}
                    </ChatList>
                    <NewChatFab aria-label="Новый чат" title="Новый чат" onClick={() => setDialogOpen(true)}>
                        <Icon name="edit" />
                    </NewChatFab>
                </>
            ) : (
                <EmptyChats>
                    <EmptyChatsArt>
                        <Icon name="bubble" />
                    </EmptyChatsArt>
                    <h2>Чатов пока нет</h2>
                    <p>Нажмите «Новый чат» и введите номер получателя</p>
                    <Button variant="primary" onClick={() => setDialogOpen(true)}>
                        <Icon name="edit" />
                        Новый чат
                    </Button>
                </EmptyChats>
            )}

            {dialogOpen && <NewChatDialog onClose={() => setDialogOpen(false)} onCreated={onCreated} />}
        </SidebarPanel>
    );
};
