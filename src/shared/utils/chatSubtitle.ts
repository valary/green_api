import type { Chat } from '../../types/chat';
import { CHAT_TEXTS } from '../constants/texts';
import { formatPhone } from './phone';

export const chatSubtitle = (chat: Chat) => {
    if (!chat.phone) return CHAT_TEXTS.chatId(chat.chatId);
    const phone = formatPhone(chat.phone);
    return chat.title === phone ? CHAT_TEXTS.inTelegram : phone;
};
