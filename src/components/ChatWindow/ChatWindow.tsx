import { selectChat, selectMessages } from '../../app/store/selectors';
import { Composer } from '../Composer/Composer';
import { retryMessage } from '../../app/store/slices/chat/thunks';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ServicePill } from '../../shared/ui/ChatBackground/ChatBackground';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageFeed } from '../MessageFeed/MessageFeed';
import { ChatWindowPanel, NoChatPlaceholder } from './ChatWindow.styles';

type Props = { chatId?: string };

export const ChatWindow = ({ chatId }: Props) => {
    const dispatch = useAppDispatch();
    const chat = useAppSelector((state) => selectChat(state, chatId));
    const messages = useAppSelector((state) => selectMessages(state, chatId ?? ''));

    if (!chat) {
        return (
            <ChatWindowPanel aria-label="Переписка">
                <NoChatPlaceholder>
                    <ServicePill>Выберите чат слева или создайте новый</ServicePill>
                </NoChatPlaceholder>
            </ChatWindowPanel>
        );
    }

    return (
        <ChatWindowPanel aria-label="Переписка">
            <ChatHeader chat={chat} />
            <MessageFeed
                messages={messages}
                onRetry={(localId) => dispatch(retryMessage({ chatId: chat.chatId, localId }))}
            />
            <Composer key={chat.chatId} chatId={chat.chatId} />
        </ChatWindowPanel>
    );
};
