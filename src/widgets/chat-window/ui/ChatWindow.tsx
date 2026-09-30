import { selectChat, selectMessages } from '@/entities/chat'
import { Composer, retryMessage } from '@/features/send-message'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux'
import { ServicePill } from '@/shared/ui'
import { ChatHeader } from './ChatHeader'
import { MessageFeed } from './MessageFeed'
import * as S from './ChatWindow.styles'

export function ChatWindow({ chatId }: { chatId?: string }) {
  const dispatch = useAppDispatch()
  const chat = useAppSelector((state) => selectChat(state, chatId))
  const messages = useAppSelector((state) => selectMessages(state, chatId ?? ''))

  if (!chat) {
    return (
      <S.Window aria-label="Переписка">
        <S.Placeholder>
          <ServicePill>Выберите чат слева или создайте новый</ServicePill>
        </S.Placeholder>
      </S.Window>
    )
  }

  return (
    <S.Window aria-label="Переписка">
      <ChatHeader chat={chat} />
      <MessageFeed
        messages={messages}
        onRetry={(localId) => dispatch(retryMessage({ chatId: chat.chatId, localId }))}
      />
      <Composer key={chat.chatId} chatId={chat.chatId} />
    </S.Window>
  )
}
