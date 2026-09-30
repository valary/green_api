import { Avatar } from '../../shared/ui/Avatar/Avatar';
import type { Chat } from '../../types/chat';
import type { Message } from '../../types/message';
import { formatListTime } from '../../shared/utils/date';
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
import { CHAT_LIST_TEXTS } from '../../shared/constants/texts';

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
                        <ChatTime $current={current}>
                            {outgoing && lastMessage.status && (
                                <LastMessageMark status={lastMessage.status} $current={current} />
                            )}
                            {formatListTime(lastMessage.timestamp)}
                        </ChatTime>
                    )}
                </ChatListLine>
                <ChatListLine>
                    <ChatPreview $current={current}>
                        {outgoing && <em>{CHAT_LIST_TEXTS.you}</em>}
                        {lastMessage?.text ?? CHAT_LIST_TEXTS.noMessages}
                    </ChatPreview>
                    {chat.unread > 0 && (
                        <UnreadBadge $current={current} aria-label={CHAT_LIST_TEXTS.unread(chat.unread)}>
                            {chat.unread}
                        </UnreadBadge>
                    )}
                </ChatListLine>
            </ChatListBody>
        </ChatListButton>
    );
};
