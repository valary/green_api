import { useEffect } from 'react'
import { deliveryStatusReceived, incomingMessageReceived, outgoingEchoReceived } from '@/entities/chat'
import { fatalErrorOccurred, networkChanged } from '@/entities/session'
import { useAppDispatch } from '@/shared/lib/redux'
import type { ReceivedEvent } from '../lib/parseNotification'
import { pollNotifications } from './pollNotifications'

function toAction(event: ReceivedEvent) {
  switch (event.kind) {
    case 'incoming':
      return incomingMessageReceived(event.message)
    case 'echo':
      return outgoingEchoReceived(event.message)
    case 'status':
      return deliveryStatusReceived(event.update)
    case 'ignored':
      return null
  }
}

export function useNotificationPolling(idInstance: string | undefined) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!idInstance) return
    const controller = new AbortController()

    void pollNotifications({
      signal: controller.signal,
      onEvent: (event) => {
        const action = toAction(event)
        if (action) dispatch(action)
      },
      onNetworkChange: (online) => dispatch(networkChanged(online)),
      onFatal: (message) => dispatch(fatalErrorOccurred(message)),
    })

    return () => controller.abort()
  }, [idInstance, dispatch])
}
