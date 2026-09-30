import { formatTime } from '../../shared/utils/date';
import { splitLinks } from '../../shared/utils/linkify';
import type { Message } from '../../types/message';
import { DeliveryMark } from '../DeliveryMark/DeliveryMark';
import {
    MessageRow,
    RetryDot,
    BubbleBody,
    MetaSpacer,
    MessageMeta,
    SendFailure,
} from './MessageBubble.styles';
import { CHAT_TEXTS } from '../../shared/constants/texts';

type Props = {
    message: Message;
    first: boolean;
    last: boolean;
    onRetry?: () => void;
};

export const MessageBubble = ({ message, first, last, onRetry }: Props) => {
    const outgoing = message.direction === 'out';
    const failed = message.status === 'error';

    return (
        <>
            <MessageRow $outgoing={outgoing} $first={first}>
                {failed && onRetry && (
                    <RetryDot
                        aria-label={CHAT_TEXTS.retrySend}
                        title={CHAT_TEXTS.retrySend}
                        onClick={onRetry}
                    >
                        !
                    </RetryDot>
                )}
                <BubbleBody $outgoing={outgoing} $first={first} $last={last}>
                    {splitLinks(message.text).map(({ text, href }, index) =>
                        href ? (
                            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
                                {text}
                            </a>
                        ) : (
                            text
                        ),
                    )}
                    <MetaSpacer $outgoing={outgoing} />
                    <MessageMeta $outgoing={outgoing}>
                        <time dateTime={new Date(message.timestamp).toISOString()}>
                            {formatTime(message.timestamp)}
                        </time>
                        {outgoing && message.status && !failed && <DeliveryMark status={message.status} />}
                    </MessageMeta>
                </BubbleBody>
            </MessageRow>
            {failed && (
                <SendFailure role="alert">
                    {CHAT_TEXTS.notSent} {message.error}
                    {onRetry && <button onClick={onRetry}>{CHAT_TEXTS.retry}</button>}
                </SendFailure>
            )}
        </>
    );
};
