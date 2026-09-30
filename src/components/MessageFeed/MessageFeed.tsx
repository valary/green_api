import { Fragment, useLayoutEffect, useRef } from 'react';
import { MessageBubble } from '@/components/MessageBubble/MessageBubble';
import { type Message } from '@/types/message';
import { ServicePill } from '@/shared/ui/ChatBackground/ChatBackground';
import { toFeedItems } from '@/shared/utils/feedItems';
import * as S from './MessageFeed.styles';

interface MessageFeedProps {
    messages: Message[];
    onRetry?: (localId: string) => void;
}

export function MessageFeed({ messages, onRetry }: MessageFeedProps) {
    const feedRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const feed = feedRef.current;
        if (feed) feed.scrollTop = feed.scrollHeight;
    }, [messages.length]);

    return (
        <S.Feed ref={feedRef} role="log" aria-live="polite" aria-label="Сообщения">
            <S.Inner>
                {messages.length === 0 && (
                    <S.EmptyCard>
                        <strong>Сообщений пока нет</strong>
                        <span>Напишите первое — оно придёт получателю в Telegram</span>
                    </S.EmptyCard>
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
            </S.Inner>
        </S.Feed>
    );
}
