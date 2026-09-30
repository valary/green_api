import { formatTime } from '@/shared/lib/date'
import { splitLinks } from '../../lib/linkify'
import type { Message } from '../../model/types'
import { DeliveryMark } from '../DeliveryMark'
import * as S from './MessageBubble.styles'

interface MessageBubbleProps {
  message: Message
  first: boolean
  last: boolean
  onRetry?: () => void
}

export function MessageBubble({ message, first, last, onRetry }: MessageBubbleProps) {
  const outgoing = message.direction === 'out'
  const failed = message.status === 'error'

  return (
    <>
      <S.Row $outgoing={outgoing} $first={first}>
        {failed && onRetry && (
          <S.RetryDot aria-label="Повторить отправку" title="Повторить отправку" onClick={onRetry}>
            !
          </S.RetryDot>
        )}
        <S.Bubble $outgoing={outgoing} $first={first} $last={last}>
          {splitLinks(message.text).map(({ text, href }, index) =>
            href ? (
              <a key={index} href={href} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            ) : (
              text
            ),
          )}
          <S.MetaSpacer $outgoing={outgoing} />
          <S.Meta $outgoing={outgoing}>
            <time dateTime={new Date(message.timestamp).toISOString()}>{formatTime(message.timestamp)}</time>
            {outgoing && message.status && !failed && <DeliveryMark status={message.status} />}
          </S.Meta>
        </S.Bubble>
      </S.Row>
      {failed && (
        <S.Failure role="alert">
          Не отправлено: {message.error}
          {onRetry && <button onClick={onRetry}>Повторить</button>}
        </S.Failure>
      )}
    </>
  )
}
