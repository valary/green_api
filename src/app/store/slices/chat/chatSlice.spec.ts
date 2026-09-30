import type { RootState } from '../../store';
import { describe, expect, it } from 'vitest';
import { selectChatPreviews } from '../../selectors';
import { chatActions, chatReducer } from './chatSlice';
import { initialChats } from './initialChats';
import type { ChatState } from '../../../../types/chat';

const reduce = (...actions: Parameters<typeof chatReducer>[1][]) =>
    actions.reduce<ChatState>(chatReducer, initialChats);

const chatId = '10000000';
const opened = [
    chatActions.chatCreated({ chatId, title: '+7 900 123-45-67', phone: '79001234567', createdAt: 1 }),
    chatActions.chatOpened(chatId),
];
const queued = chatActions.messageQueued({ chatId, localId: 'local-1', text: 'Привет', timestamp: 2 });
const incoming = { chatId, idMessage: 'in-1', text: 'Ответ', timestamp: 3, senderName: 'Иван' };

describe('chatSlice', () => {
    it('не создаёт второй чат с тем же chatId', () => {
        const state = reduce(
            ...opened,
            chatActions.chatCreated({ chatId, title: 'другое имя', phone: '79001234567', createdAt: 5 }),
        );

        expect(Object.keys(state.chats)).toEqual([chatId]);
        expect(state.chats[chatId].title).toBe('+7 900 123-45-67');
    });

    it('повторное уведомление с тем же idMessage показывается один раз', () => {
        const state = reduce(
            ...opened,
            chatActions.incomingMessageReceived(incoming),
            chatActions.incomingMessageReceived(incoming),
        );

        expect(state.messages[chatId]).toHaveLength(1);
    });

    it('эхо раньше ответа sendMessage склеивается с отправленным сообщением', () => {
        const state = reduce(
            ...opened,
            queued,
            chatActions.outgoingEchoReceived({ chatId, idMessage: 'out-1', text: 'Привет', timestamp: 2 }),
            chatActions.messageSent({ chatId, localId: 'local-1', idMessage: 'out-1' }),
        );

        expect(state.messages[chatId]).toEqual([
            expect.objectContaining({ idMessage: 'out-1', status: 'sent' }),
        ]);
    });

    it('статус, пришедший раньше idMessage, применяется после ответа', () => {
        const state = reduce(
            ...opened,
            queued,
            chatActions.deliveryStatusReceived({ chatId, idMessage: 'out-1', status: 'read' }),
            chatActions.messageSent({ chatId, localId: 'local-1', idMessage: 'out-1' }),
        );

        expect(state.messages[chatId][0].status).toBe('read');
        expect(state.pendingStatuses).toEqual({});
    });

    it('статус не откатывается назад, а failed превращается в ошибку с причиной', () => {
        const sent = [
            ...opened,
            queued,
            chatActions.messageSent({ chatId, localId: 'local-1', idMessage: 'out-1' }),
        ];
        const read = reduce(
            ...sent,
            chatActions.deliveryStatusReceived({ chatId, idMessage: 'out-1', status: 'read' }),
            chatActions.deliveryStatusReceived({ chatId, idMessage: 'out-1', status: 'delivered' }),
        );
        const failed = reduce(
            ...sent,
            chatActions.deliveryStatusReceived({
                chatId,
                idMessage: 'out-1',
                status: 'failed',
                description: 'chatId unresolvable',
            }),
        );

        expect(read.messages[chatId][0].status).toBe('read');
        expect(failed.messages[chatId][0]).toMatchObject({ status: 'error', error: 'chatId unresolvable' });
    });

    it('ошибка отправки не затирает сообщение, которое уже подтвердило эхо', () => {
        const state = reduce(
            ...opened,
            queued,
            chatActions.outgoingEchoReceived({ chatId, idMessage: 'out-1', text: 'Привет', timestamp: 2 }),
            chatActions.messageFailed({ chatId, localId: 'local-1', reason: 'нет связи' }),
        );

        expect(state.messages[chatId][0].status).toBe('sent');
    });

    it('входящее от незнакомого chatId создаёт чат со счётчиком непрочитанных', () => {
        const state = reduce(
            ...opened,
            chatActions.incomingMessageReceived({ ...incoming, chatId: '20000000' }),
        );

        expect(state.chats['20000000']).toMatchObject({ title: 'Иван', unread: 1 });
        expect(state.chats[chatId].unread).toBe(0);

        const afterOpen = chatReducer(state, chatActions.chatOpened('20000000'));
        expect(afterOpen.chats['20000000'].unread).toBe(0);
    });

    it('в списке сверху чат с последним сообщением', () => {
        const state = reduce(
            ...opened,
            chatActions.incomingMessageReceived({ ...incoming, chatId: '20000000', timestamp: 10 }),
        );
        const previews = selectChatPreviews({ chat: state } as RootState);

        expect(previews.map((preview) => preview.chat.chatId)).toEqual(['20000000', chatId]);
        expect(previews[0].lastMessage?.text).toBe('Ответ');
    });
});
