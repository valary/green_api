// '+7 (900) 123-45-67' и '89001234567' → '79001234567'. Международный номер — 11–15 цифр.
export const normalizePhone = (input: string) => {
    const digits = input.replace(/[\s+\-().]/g, '');
    if (!/^\d{11,15}$/.test(digits)) return null;
    return digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
};

export const formatPhone = (digits: string) => {
    if (digits.length === 11 && digits.startsWith('7')) {
        return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
    }
    return `+${digits}`;
};
