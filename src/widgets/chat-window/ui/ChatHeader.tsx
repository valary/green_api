import { useNavigate } from 'react-router-dom'
import { Avatar, type Chat } from '@/entities/chat'
import { DemoBadge } from '@/entities/session'
import { formatPhone } from '@/shared/lib/phone'
import { Icon } from '@/shared/ui'
import * as S from './ChatHeader.styles'

function subtitle(chat: Chat) {
  if (!chat.phone) return `chatId ${chat.chatId}`
  const phone = formatPhone(chat.phone)
  return chat.title === phone ? 'в Telegram' : phone
}

export function ChatHeader({ chat }: { chat: Chat }) {
  const navigate = useNavigate()

  return (
    <S.Header>
      <S.Back aria-label="Назад к чатам" onClick={() => navigate('/chat')}>
        <Icon name="back" />
      </S.Back>
      <Avatar chatId={chat.chatId} title={chat.title} small />
      <S.Info>
        <S.Name>{chat.title}</S.Name>
        <S.Subtitle>{subtitle(chat)}</S.Subtitle>
      </S.Info>
      <S.MobileBadge>
        <DemoBadge />
      </S.MobileBadge>
    </S.Header>
  )
}
