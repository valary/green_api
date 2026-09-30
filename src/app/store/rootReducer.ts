import { combineReducers } from '@reduxjs/toolkit';
import { chatSlice } from './slices/chat/chatSlice';
import { connectionSlice } from './slices/connection/connectionSlice';
import { loggedOut, sessionSlice } from './slices/session/sessionSlice';

const appReducer = combineReducers({
    session: sessionSlice.reducer,
    connection: connectionSlice.reducer,
    chat: chatSlice.reducer,
});

// Выход обнуляет всё разом: чаты, баннеры, сессию.
export const rootReducer: typeof appReducer = (state, action) =>
    appReducer(loggedOut.match(action) ? undefined : state, action);
