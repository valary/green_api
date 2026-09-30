// Для номера — две последние цифры, для имени — первые буквы двух слов.
export const initials = (title: string) => {
    if (/^[+\d\s()-]+$/.test(title)) return title.replace(/\D/g, '').slice(-2);
    return title
        .split(/[\s-]+/)
        .slice(0, 2)
        .map((word) => word[0] ?? '')
        .join('')
        .toUpperCase();
};

export const avatarIndex = (chatId: string) => {
    let hash = 0;
    for (const char of chatId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return hash % 7;
};
