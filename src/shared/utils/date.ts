import { CHAT_LIST_TEXTS, CHAT_TEXTS } from '../constants/texts';
const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' });

export const formatTime = (ms: number) => time.format(ms);

export const isSameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();

const isYesterday = (ms: number, now: number) => isSameDay(ms, now - 24 * 60 * 60 * 1000);

export const formatListTime = (ms: number, now = Date.now()) => {
    if (isSameDay(ms, now)) return formatTime(ms);
    return isYesterday(ms, now) ? CHAT_LIST_TEXTS.yesterday : dayMonth.format(ms);
};

export const formatDayLabel = (ms: number, now = Date.now()) => {
    if (isSameDay(ms, now)) return CHAT_TEXTS.today;
    return isYesterday(ms, now) ? CHAT_TEXTS.yesterday : dayMonth.format(ms);
};
