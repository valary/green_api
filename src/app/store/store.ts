import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatSlice } from '@/entities/chat';
import { connectionSlice, loggedOut, sessionSlice } from '@/entities/session';

const appReducer = combineReducers({
    session: sessionSlice.reducer,
    connection: connectionSlice.reducer,
    chat: chatSlice.reducer,
});

export type RootState = ReturnType<typeof appReducer>;

// Выход обнуляет всё разом: чаты, баннеры, сессию.
const rootReducer: typeof appReducer = (state, action) =>
    appReducer(loggedOut.match(action) ? undefined : state, action);

export const createStore = (preloadedState?: Partial<RootState>) =>
    configureStore({ reducer: rootReducer, preloadedState, devTools: import.meta.env.DEV });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
