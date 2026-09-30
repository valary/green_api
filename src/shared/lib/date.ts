const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })

export const formatTime = (ms: number) => time.format(ms)

export const isSameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString()

const isYesterday = (ms: number, now: number) => isSameDay(ms, now - 24 * 60 * 60 * 1000)

export function formatListTime(ms: number, now = Date.now()) {
  if (isSameDay(ms, now)) return formatTime(ms)
  return isYesterday(ms, now) ? 'вчера' : dayMonth.format(ms)
}

export function formatDayLabel(ms: number, now = Date.now()) {
  if (isSameDay(ms, now)) return 'Сегодня'
  return isYesterday(ms, now) ? 'Вчера' : dayMonth.format(ms)
}
