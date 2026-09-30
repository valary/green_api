import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { chatClosed, chatOpened, selectChat } from '@/entities/chat'
import { selectSession } from '@/entities/session'
import { useNotificationPolling } from '@/features/receive-notifications'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'
import { ConnectionBanners } from '@/widgets/connection-banners'
import * as S from './ChatPage.styles'

export function ChatPage() {
  const { chatId } = useParams()
  const dispatch = useAppDispatch()
  const chatExists = useAppSelector((state) => Boolean(selectChat(state, chatId)))
  const session = useAppSelector(selectSession)

  useNotificationPolling(session?.idInstance)

  useEffect(() => {
    if (!chatId || !chatExists) return
    dispatch(chatOpened(chatId))
    return () => {
      dispatch(chatClosed())
    }
  }, [chatId, chatExists, dispatch])

  if (chatId && !chatExists) return <Navigate to="/chat" replace />

  return (
    <S.Layout $chatOpen={Boolean(chatId)}>
      <ConnectionBanners />
      <ChatSidebar activeChatId={chatId} />
      <ChatWindow chatId={chatId} />
    </S.Layout>
  )
}
