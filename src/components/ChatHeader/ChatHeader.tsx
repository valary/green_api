import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar/Avatar';
import type { Chat } from '../../types/chat';
import { DemoBadge } from '../DemoBadge/DemoBadge';
import { formatPhone } from '../../shared/utils/phone';
import { Icon } from '../../shared/ui/Icon/Icon';
import {
    ChatHeaderBar,
    BackButton,
    ChatInfo,
    ChatName,
    ChatSubtitle,
    MobileDemoBadge,
} from './ChatHeader.styles';
import { CHAT_TEXTS } from '../../shared/constants/texts';

const subtitle = (chat: Chat) => {
    if (!chat.phone) return CHAT_TEXTS.chatId(chat.chatId);
    const phone = formatPhone(chat.phone);
    return chat.title === phone ? CHAT_TEXTS.inTelegram : phone;
};

type Props = { chat: Chat };

export const ChatHeader = ({ chat }: Props) => {
    const navigate = useNavigate();

    return (
        <ChatHeaderBar>
            <BackButton aria-label={CHAT_TEXTS.back} onClick={() => navigate('/chat')}>
                <Icon name="back" />
            </BackButton>
            <Avatar chatId={chat.chatId} title={chat.title} small />
            <ChatInfo>
                <ChatName>{chat.title}</ChatName>
                <ChatSubtitle>{subtitle(chat)}</ChatSubtitle>
            </ChatInfo>
            <MobileDemoBadge>
                <DemoBadge />
            </MobileDemoBadge>
        </ChatHeaderBar>
    );
};
