import { selectChat, selectMessages } from '@/app/store/selectors';
import { Composer } from '@/components/Composer/Composer';
import { retryMessage } from '@/app/store/slices/chat/thunks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { ServicePill } from '@/shared/ui/ChatBackground/ChatBackground';
import { ChatHeader } from '@/components/ChatHeader/ChatHeader';
import { MessageFeed } from '@/components/MessageFeed/MessageFeed';
import * as S from './ChatWindow.styles';

export function ChatWindow({ chatId }: { chatId?: string }) {
    const dispatch = useAppDispatch();
    const chat = useAppSelector((state) => selectChat(state, chatId));
    const messages = useAppSelector((state) => selectMessages(state, chatId ?? ''));

    if (!chat) {
        return (
            <S.Window aria-label="Переписка">
                <S.Placeholder>
                    <ServicePill>Выберите чат слева или создайте новый</ServicePill>
                </S.Placeholder>
            </S.Window>
        );
    }

    return (
        <S.Window aria-label="Переписка">
            <ChatHeader chat={chat} />
            <MessageFeed
                messages={messages}
                onRetry={(localId) => dispatch(retryMessage({ chatId: chat.chatId, localId }))}
            />
            <Composer key={chat.chatId} chatId={chat.chatId} />
        </S.Window>
    );
}
