import { Avatar } from '@/shared/ui/Avatar/Avatar';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { formatListTime } from '@/shared/utils/date';
import {
    ChatListButton,
    ChatListBody,
    ChatListLine,
    ChatName,
    ChatTime,
    LastMessageMark,
    ChatPreview,
    UnreadBadge,
} from './ChatListItem.styles';

type Props = {
    chat: Chat;
    lastMessage?: Message;
    current: boolean;
    onOpen: (chatId: string) => void;
};

export const ChatListItem = ({ chat, lastMessage, current, onOpen }: Props) => {
    const outgoing = lastMessage?.direction === 'out';

    return (
        <ChatListButton
            type="button"
            aria-current={current || undefined}
            $current={current}
            onClick={() => onOpen(chat.chatId)}
        >
            <Avatar chatId={chat.chatId} title={chat.title} />
            <ChatListBody>
                <ChatListLine>
                    <ChatName>{chat.title}</ChatName>
                    {lastMessage && (
                        <ChatTime>
                            {outgoing && lastMessage.status && (
                                <LastMessageMark status={lastMessage.status} />
                            )}
                            {formatListTime(lastMessage.timestamp)}
                        </ChatTime>
                    )}
                </ChatListLine>
                <ChatListLine>
                    <ChatPreview>
                        {outgoing && <em>Вы: </em>}
                        {lastMessage?.text ?? 'Сообщений пока нет'}
                    </ChatPreview>
                    {chat.unread > 0 && (
                        <UnreadBadge aria-label={`Непрочитанных: ${chat.unread}`}>{chat.unread}</UnreadBadge>
                    )}
                </ChatListLine>
            </ChatListBody>
        </ChatListButton>
    );
};
