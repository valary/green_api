import type { Message } from '@/types/message';
import { formatDayLabel, isSameDay } from './date';

// Пузыри группируются подряд по направлению в пределах дня; хвост — у последнего в группе.
export function toFeedItems(messages: Message[]) {
    return messages.map((message, index) => {
        const prev = messages[index - 1];
        const next = messages[index + 1];
        const newDay = !prev || !isSameDay(prev.timestamp, message.timestamp);

        return {
            message,
            dayLabel: newDay ? formatDayLabel(message.timestamp) : null,
            first: newDay || prev.direction !== message.direction,
            last:
                !next ||
                next.direction !== message.direction ||
                !isSameDay(next.timestamp, message.timestamp),
        };
    });
}
