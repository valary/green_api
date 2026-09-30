import { Fragment, useLayoutEffect, useRef } from 'react';
import { MessageBubble } from '@/components/MessageBubble/MessageBubble';
import type { Message } from '@/types/message';
import { ServicePill } from '@/shared/ui/ChatBackground/ChatBackground';
import { toFeedItems } from '@/shared/utils/feedItems';
import { FeedScroller, FeedColumn, EmptyChatCard } from './MessageFeed.styles';

type Props = {
    messages: Message[];
    onRetry?: (localId: string) => void;
};

export const MessageFeed = ({ messages, onRetry }: Props) => {
    const feedRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const feed = feedRef.current;
        if (feed) feed.scrollTop = feed.scrollHeight;
    }, [messages.length]);

    return (
        <FeedScroller ref={feedRef} role="log" aria-live="polite" aria-label="Сообщения">
            <FeedColumn>
                {messages.length === 0 && (
                    <EmptyChatCard>
                        <strong>Сообщений пока нет</strong>
                        <span>Напишите первое — оно придёт получателю в Telegram</span>
                    </EmptyChatCard>
                )}
                {toFeedItems(messages).map(({ message, dayLabel, first, last }) => (
                    <Fragment key={message.localId}>
                        {dayLabel && <ServicePill>{dayLabel}</ServicePill>}
                        <MessageBubble
                            message={message}
                            first={first}
                            last={last}
                            onRetry={onRetry && (() => onRetry(message.localId))}
                        />
                    </Fragment>
                ))}
            </FeedColumn>
        </FeedScroller>
    );
};
