import { greenApi, isFatal, isTransient, toApiError, type ApiError } from '@/shared/api'
import { wait } from '@/shared/lib/wait'
import { parseNotification, type ReceivedEvent } from '../lib/parseNotification'

export const BACKOFF_MS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000]

interface PollOptions {
  signal: AbortSignal
  onEvent: (event: ReceivedEvent) => void
  onNetworkChange: (online: boolean) => void
  onFatal: (message: string) => void
  sleep?: typeof wait
}

// Строго последовательно: receive → обработка → delete → следующий receive. Никаких setInterval —
// иначе запросы наслаиваются, а без delete очередь GREEN-API встаёт на одном уведомлении навсегда.
export async function pollNotifications({
  signal,
  onEvent,
  onNetworkChange,
  onFatal,
  sleep = wait,
}: PollOptions) {
  let failures = 0
  let offline = false

  const succeeded = () => {
    failures = 0
    if (offline) {
      offline = false
      onNetworkChange(true)
    }
  }

  const backOff = async (error: ApiError) => {
    if (signal.aborted || error.kind === 'aborted') return false
    if (isFatal(error)) {
      onFatal(error.message)
      return false
    }
    if (isTransient(error) && !offline) {
      offline = true
      onNetworkChange(false)
    }
    await sleep(BACKOFF_MS[Math.min(failures++, BACKOFF_MS.length - 1)], signal)
    return !signal.aborted
  }

  const remove = async (receiptId: number) => {
    while (!signal.aborted) {
      try {
        await greenApi.deleteNotification(receiptId)
        succeeded()
        return
      } catch (e) {
        if (!(await backOff(toApiError(e)))) return
      }
    }
  }

  while (!signal.aborted) {
    let notification
    try {
      notification = await greenApi.receiveNotification(signal)
      succeeded()
    } catch (e) {
      if (await backOff(toApiError(e))) continue
      return
    }
    if (!notification) continue

    try {
      onEvent(parseNotification(notification.body))
    } catch {
      // сломанное уведомление всё равно удаляем, иначе оно будет приходить вечно
    }
    await remove(notification.receiptId)
  }
}
