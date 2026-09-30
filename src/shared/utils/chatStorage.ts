import { readJson, writeJson } from './storage';
import type { ChatState, PersistedChats } from '../../types/chat';
import { ERROR_TEXTS } from '../constants/texts';

const key = (idInstance: string) => `chats:${idInstance}`;

export const loadChats = (idInstance: string, remember: boolean) =>
    readJson<PersistedChats>(key(idInstance), remember);

// После перезагрузки «отправляется» уже никогда не отправится — честно помечаем ошибкой.
export const saveChats = (idInstance: string, remember: boolean, { chats, messages }: ChatState) => {
    const settled = Object.fromEntries(
        Object.entries(messages).map(([chatId, list]) => [
            chatId,
            list.map((m) =>
                m.status === 'sending'
                    ? { ...m, status: 'error' as const, error: ERROR_TEXTS.interrupted }
                    : m,
            ),
        ]),
    );
    writeJson(key(idInstance), { chats, messages: settled }, remember);
};
