import { expect, it } from 'vitest';
import type { Message } from '@/entities/message';
import { toFeedItems } from './feedItems';

const day = new Date(2026, 8, 30, 12).getTime();
const message = (localId: string, direction: Message['direction'], timestamp = day): Message => ({
    localId,
    chatId: '1',
    direction,
    text: localId,
    timestamp,
});

it('хвост только у последнего пузыря в группе, новый день начинает новую группу', () => {
    const items = toFeedItems([
        message('a', 'out'),
        message('b', 'out'),
        message('c', 'in'),
        message('d', 'in', day + 24 * 60 * 60 * 1000),
    ]);

    expect(items.map(({ first, last }) => [first, last])).toEqual([
        [true, false],
        [false, true],
        [true, true],
        [true, true],
    ]);
    expect(items.map(({ dayLabel }) => Boolean(dayLabel))).toEqual([true, false, false, true]);
});
