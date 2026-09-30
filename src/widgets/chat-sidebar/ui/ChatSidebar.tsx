import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectChatPreviews } from '@/entities/chat'
import { DemoBadge } from '@/entities/session'
import { NewChatDialog } from '@/features/create-chat'
import { LogoutButton } from '@/features/logout'
import { useAppSelector } from '@/shared/lib/redux'
import { Button, Icon } from '@/shared/ui'
import { ChatListItem } from './ChatListItem/ChatListItem'
import * as S from './ChatSidebar.styles'

export function ChatSidebar({ activeChatId }: { activeChatId?: string }) {
  const navigate = useNavigate()
  const previews = useAppSelector(selectChatPreviews)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openChat = (chatId: string) => navigate(`/chat/${chatId}`)
  const onCreated = (chatId: string) => {
    setDialogOpen(false)
    openChat(chatId)
  }

  return (
    <S.Sidebar aria-label="Чаты">
      <S.Header>
        <S.Title>Чаты</S.Title>
        <DemoBadge />
        <S.Spacer />
        <LogoutButton />
      </S.Header>

      {previews.length > 0 ? (
        <>
          <S.List>
            {previews.map(({ chat, lastMessage }) => (
              <li key={chat.chatId}>
                <ChatListItem
                  chat={chat}
                  lastMessage={lastMessage}
                  current={chat.chatId === activeChatId}
                  onOpen={openChat}
                />
              </li>
            ))}
          </S.List>
          <S.Fab aria-label="Новый чат" title="Новый чат" onClick={() => setDialogOpen(true)}>
            <Icon name="edit" />
          </S.Fab>
        </>
      ) : (
        <S.Empty>
          <S.EmptyArt>
            <Icon name="bubble" />
          </S.EmptyArt>
          <h2>Чатов пока нет</h2>
          <p>Нажмите «Новый чат» и введите номер получателя</p>
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            <Icon name="edit" />
            Новый чат
          </Button>
        </S.Empty>
      )}

      {dialogOpen && <NewChatDialog onClose={() => setDialogOpen(false)} onCreated={onCreated} />}
    </S.Sidebar>
  )
}
