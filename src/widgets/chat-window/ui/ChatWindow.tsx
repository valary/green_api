import { selectChat, selectMessages } from '@/entities/chat'
import { useAppSelector } from '@/shared/lib/redux'
import { ServicePill } from '@/shared/ui'
import { ChatHeader } from './ChatHeader'
import { MessageFeed } from './MessageFeed'
import * as S from './ChatWindow.styles'

export function ChatWindow({ chatId }: { chatId?: string }) {
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
      <MessageFeed messages={messages} />
    </S.Window>
  )
}
