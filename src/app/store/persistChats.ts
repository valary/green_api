import { saveChats } from '@/shared/utils/chatStorage';
import type { AppStore } from './store';

// Чаты лежат там же, где сессия: без «Запомнить» — только до закрытия вкладки.
export const persistChats = (store: AppStore) => {
    let saved = store.getState().chat;

    return store.subscribe(() => {
        const { session, chat } = store.getState();
        if (!session.current || chat === saved) return;
        saved = chat;
        saveChats(session.current.idInstance, session.current.remember, chat);
    });
};
