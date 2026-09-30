// Держим задачу только в одной вкладке. Остальные ждут в очереди замка и подхватывают работу,
// когда первая закроется. Нет Web Locks (старый браузер) — просто выполняем.
export async function runInSingleTab(
  name: string,
  signal: AbortSignal,
  onWaiting: (waiting: boolean) => void,
  task: () => Promise<void>,
) {
  if (!navigator.locks) return task()

  const acquired = await navigator.locks.request(name, { ifAvailable: true }, async (lock) => {
    if (!lock) return false
    await task()
    return true
  })
  if (acquired || signal.aborted) return

  onWaiting(true)
  try {
    await navigator.locks.request(name, { signal }, async () => {
      onWaiting(false)
      await task()
    })
  } catch {
    // замок отменили: вышли из аккаунта или закрыли страницу
  }
}
