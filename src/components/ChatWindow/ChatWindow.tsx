import { useChatWindow } from '../../hooks/useChatWindow';
import { CHAT_TEXTS } from '../../shared/constants/texts';
import { ServicePill } from '../../shared/ui/ChatBackground/ChatBackground';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { Composer } from '../Composer/Composer';
import { MessageFeed } from '../MessageFeed/MessageFeed';
import { ChatWindowPanel, NoChatPlaceholder } from './ChatWindow.styles';

type Props = { chatId?: string };

export const ChatWindow = ({ chatId }: Props) => {
    const { chat, messages, retry } = useChatWindow(chatId);

    if (!chat) {
        return (
            <ChatWindowPanel aria-label={CHAT_TEXTS.region}>
                <NoChatPlaceholder>
                    <ServicePill>{CHAT_TEXTS.placeholder}</ServicePill>
                </NoChatPlaceholder>
            </ChatWindowPanel>
        );
    }

    return (
        <ChatWindowPanel aria-label={CHAT_TEXTS.region}>
            <ChatHeader chat={chat} />
            <MessageFeed messages={messages} onRetry={retry} />
            <Composer key={chat.chatId} chatId={chat.chatId} />
        </ChatWindowPanel>
    );
};
