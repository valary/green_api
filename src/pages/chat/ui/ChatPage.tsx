import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { chatClosed, chatOpened, selectChat } from '@/entities/chat'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'
import * as S from './ChatPage.styles'

export function ChatPage() {
  const { chatId } = useParams()
  const dispatch = useAppDispatch()
  const chatExists = useAppSelector((state) => Boolean(selectChat(state, chatId)))

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
      <ChatSidebar activeChatId={chatId} />
      <ChatWindow chatId={chatId} />
    </S.Layout>
  )
}
