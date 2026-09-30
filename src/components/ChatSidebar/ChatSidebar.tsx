import { useChatList } from '../../hooks/useChatList';
import { CHAT_LIST_TEXTS } from '../../shared/constants/texts';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { DemoBadge } from '../DemoBadge/DemoBadge';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { NewChatDialog } from '../NewChatDialog/NewChatDialog';
import {
    ChatList,
    EmptyChats,
    EmptyChatsArt,
    HeaderSpacer,
    NewChatFab,
    SidebarHeader,
    SidebarPanel,
    SidebarTitle,
} from './ChatSidebar.styles';

type Props = { activeChatId?: string };

export const ChatSidebar = ({ activeChatId }: Props) => {
    const { previews, openChat, dialogOpen, openDialog, closeDialog, onChatCreated } = useChatList();

    return (
        <SidebarPanel aria-label={CHAT_LIST_TEXTS.title}>
            <SidebarHeader>
                <SidebarTitle>{CHAT_LIST_TEXTS.title}</SidebarTitle>
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
                    <NewChatFab
                        aria-label={CHAT_LIST_TEXTS.newChat}
                        title={CHAT_LIST_TEXTS.newChat}
                        onClick={openDialog}
                    >
                        <Icon name="edit" />
                    </NewChatFab>
                </>
            ) : (
                <EmptyChats>
                    <EmptyChatsArt>
                        <Icon name="bubble" />
                    </EmptyChatsArt>
                    <h2>{CHAT_LIST_TEXTS.emptyTitle}</h2>
                    <p>{CHAT_LIST_TEXTS.emptyHint}</p>
                    <Button variant="primary" onClick={openDialog}>
                        <Icon name="edit" />
                        {CHAT_LIST_TEXTS.newChat}
                    </Button>
                </EmptyChats>
            )}

            {dialogOpen && <NewChatDialog onClose={closeDialog} onCreated={onChatCreated} />}
        </SidebarPanel>
    );
};
