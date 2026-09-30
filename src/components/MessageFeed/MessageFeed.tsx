import { Fragment } from 'react';
import { useScrollToBottom } from '../../hooks/useScrollToBottom';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import type { Message } from '../../types/message';
import { ServicePill } from '../../shared/ui/ChatBackground/ChatBackground';
import { toFeedItems } from '../../shared/utils/feedItems';
import { FeedScroller, FeedColumn, EmptyChatCard } from './MessageFeed.styles';
import { CHAT_TEXTS } from '../../shared/constants/texts';

type Props = {
    messages: Message[];
    onRetry?: (localId: string) => void;
};

export const MessageFeed = ({ messages, onRetry }: Props) => {
    const feedRef = useScrollToBottom(messages.length);

    return (
        <FeedScroller ref={feedRef} role="log" aria-live="polite" aria-label={CHAT_TEXTS.feed}>
            <FeedColumn>
                {messages.length === 0 && (
                    <EmptyChatCard>
                        <strong>{CHAT_TEXTS.emptyTitle}</strong>
                        <span>{CHAT_TEXTS.emptyHint}</span>
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
