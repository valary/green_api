import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { type Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { formatListTime } from '@/shared/utils/date';
import * as S from './ChatListItem.styles';

interface ChatListItemProps {
    chat: Chat;
    lastMessage?: Message;
    current: boolean;
    onOpen: (chatId: string) => void;
}

export function ChatListItem({ chat, lastMessage, current, onOpen }: ChatListItemProps) {
    const outgoing = lastMessage?.direction === 'out';

    return (
        <S.Item
            type="button"
            aria-current={current || undefined}
            $current={current}
            onClick={() => onOpen(chat.chatId)}
        >
            <Avatar chatId={chat.chatId} title={chat.title} />
            <S.Body>
                <S.Line>
                    <S.Name>{chat.title}</S.Name>
                    {lastMessage && (
                        <S.Time>
                            {outgoing && lastMessage.status && <S.Mark status={lastMessage.status} />}
                            {formatListTime(lastMessage.timestamp)}
                        </S.Time>
                    )}
                </S.Line>
                <S.Line>
                    <S.Preview>
                        {outgoing && <em>Вы: </em>}
                        {lastMessage?.text ?? 'Сообщений пока нет'}
                    </S.Preview>
                    {chat.unread > 0 && (
                        <S.Unread aria-label={`Непрочитанных: ${chat.unread}`}>{chat.unread}</S.Unread>
                    )}
                </S.Line>
            </S.Body>
        </S.Item>
    );
}
