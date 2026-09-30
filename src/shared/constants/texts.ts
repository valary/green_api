import type { DemoScenario } from '../../types/session';

export const LOGIN_TEXTS = {
    title: 'Вход по данным GREEN-API',
    lead: 'idInstance и apiTokenInstance — на странице инстанса в личном кабинете GREEN-API',
    idInstanceLabel: 'idInstance',
    idInstancePlaceholder: '1101000001',
    idInstanceHint: 'Номер инстанса, только цифры',
    idInstanceRequired: 'Введите idInstance',
    idInstanceFormat: 'Только цифры, например 1101000001',
    tokenLabel: 'apiTokenInstance',
    tokenPlaceholder: 'Токен',
    tokenRequired: 'Введите apiTokenInstance',
    showToken: 'Показать токен',
    hideToken: 'Скрыть токен',
    apiUrlLabel: 'apiUrl',
    apiUrlPlaceholder: 'https://1101.api.green-api.com',
    apiUrlHint: 'Подставляется по idInstance. Меняйте, только если в кабинете указан другой',
    apiUrlRequired: 'Введите apiUrl',
    apiUrlFormat: 'Адрес вида https://1101.api.green-api.com',
    remember: 'Запомнить на этом устройстве',
    rememberHint: 'Токен останется в браузере после закрытия вкладки. Не включайте на чужом компьютере',
    submit: 'Войти',
    submitting: 'Проверяем инстанс…',
    networkError: 'Нет связи с GREEN-API. Проверьте интернет и нажмите «Войти» ещё раз',
};

export const DEMO_TEXTS = {
    divider: 'или',
    open: 'Открыть демо без данных',
    opening: 'Открываем демо…',
    failed: 'Не получилось запустить демо: браузер не дал зарегистрировать service worker',
    badge: 'Демо',
    badgeTitle: 'Данные не уходят в GREEN-API — это имитация',
    hints: {
        default: 'Всё работает на имитации: сообщения никуда не уходят',
        settings: 'Сценарий: у инстанса задан webhookUrl — появится предупреждение',
        offline: 'Сценарий: через 5 секунд пропадёт связь на 20 секунд',
        sendError: 'Сценарий: первая отправка упадёт, «Повторить» пройдёт',
        newChat: 'Сценарий: через 3 секунды напишет незнакомый человек',
    } satisfies Record<DemoScenario, string>,
};

export const CHAT_LIST_TEXTS = {
    title: 'Чаты',
    logout: 'Выйти',
    newChat: 'Новый чат',
    emptyTitle: 'Чатов пока нет',
    emptyHint: 'Нажмите «Новый чат» и введите номер получателя',
    noMessages: 'Сообщений пока нет',
    you: 'Вы: ',
    yesterday: 'вчера',
    unread: (count: number) => `Непрочитанных: ${count}`,
};

export const NEW_CHAT_TEXTS = {
    title: 'Новый чат',
    phoneLabel: 'Номер телефона',
    phonePlaceholder: '+7 900 123-45-67',
    phoneHint: 'В международном формате, можно с пробелами и скобками',
    phoneFormat: 'Введите номер в международном формате, например +7 900 123-45-67',
    notFound:
        'Номер не найден в Telegram или скрыт настройками приватности. Попросите получателя добавить ваш номер в контакты',
    networkError: 'Нет связи с GREEN-API. Проверьте интернет и попробуйте ещё раз',
    cancel: 'Отмена',
    close: 'Закрыть',
    submit: 'Открыть чат',
    submitting: 'Ищем в Telegram…',
};

export const CHAT_TEXTS = {
    region: 'Переписка',
    placeholder: 'Выберите чат слева или создайте новый',
    back: 'Назад к чатам',
    inTelegram: 'в Telegram',
    chatId: (chatId: string) => `chatId ${chatId}`,
    feed: 'Сообщения',
    emptyTitle: 'Сообщений пока нет',
    emptyHint: 'Напишите первое — оно придёт получателю в Telegram',
    today: 'Сегодня',
    yesterday: 'Вчера',
    notSent: 'Не отправлено:',
    retry: 'Повторить',
    retrySend: 'Повторить отправку',
};

export const MESSAGE_STATUS_TEXTS = {
    sending: 'Отправляется',
    sent: 'Отправлено',
    delivered: 'Доставлено',
    read: 'Прочитано',
    error: 'Не отправлено',
};

export const COMPOSER_TEXTS = {
    label: 'Сообщение',
    placeholder: 'Сообщение',
    send: 'Отправить',
    tooLong: 'Сообщение длиннее 4 096 символов — сократите его',
};

export const BANNER_TEXTS = {
    relogin: 'Выйти и ввести заново',
    receiveProblem: (problem: string) => `Приём сообщений не работает: ${problem}`,
    otherTab: 'Сообщения принимает другая вкладка с этим инстансом. Закройте её — приём продолжится здесь',
    dismiss: 'Скрыть',
};

export const SETTINGS_TEXTS = {
    clearWebhook: 'очистите webhookUrl',
    enableIncoming: 'включите incomingWebhook',
    incomingBroken: (fixes: string) =>
        `Входящие сообщения не будут приходить: в настройках инстанса ${fixes}. Изменения применяются до 5 минут.`,
    noStatuses: 'Статусы ✓✓ тоже не появятся: включите outgoingWebhook',
    onlyStatuses:
        'Статусы ✓✓ показываться не будут: в настройках инстанса включите outgoingWebhook. Изменения применяются до 5 минут.',
};

export const ERROR_TEXTS = {
    unauthorized: 'Неверный apiTokenInstance. Проверьте токен в личном кабинете GREEN-API',
    forbidden: 'Неверный idInstance или apiUrl',
    quota: 'Исчерпан лимит чатов тарифа (Developer — 3 чата в месяц). Лимит обновится 1-го числа',
    rateLimit: 'Слишком много запросов. Подождите минуту и повторите',
    webhookSet:
        'Входящие сообщения не будут приходить: в настройках инстанса очистите webhookUrl. Изменения применяются до 5 минут.',
    server: 'Сервер GREEN-API временно недоступен. Повторяем…',
    network: 'Нет связи с GREEN-API. Переподключаемся…',
    notAuthorized: (state: string) =>
        `Инстанс не авторизован в Telegram (статус: ${state}). Откройте личный кабинет GREEN-API и подключите аккаунт по QR-коду`,
    rejected: (details: string) => `Запрос отклонён GREEN-API${details}`,
    sendOffline: 'нет связи',
    sendServer: 'сервер GREEN-API временно недоступен',
    noAccount: 'получатель не найден',
    deliveryFailed: 'ошибка доставки',
    interrupted: 'отправка прервана',
};
