import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar/Avatar';
import type { Chat } from '../../types/chat';
import { DemoBadge } from '../DemoBadge/DemoBadge';
import { chatSubtitle } from '../../shared/utils/chatSubtitle';
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
                <ChatSubtitle>{chatSubtitle(chat)}</ChatSubtitle>
            </ChatInfo>
            <MobileDemoBadge>
                <DemoBadge />
            </MobileDemoBadge>
        </ChatHeaderBar>
    );
};
