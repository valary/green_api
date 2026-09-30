// У GREEN-API хост инстанса — первые 4 цифры idInstance. Правило не задокументировано, поэтому поле можно править.
export function deriveApiUrl(idInstance: string) {
    const id = idInstance.trim();
    return /^\d{4,}$/.test(id) ? `https://${id.slice(0, 4)}.api.green-api.com` : '';
}
