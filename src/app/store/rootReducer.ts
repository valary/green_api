import { combineReducers } from '@reduxjs/toolkit';
import { chatReducer } from './slices/chat/chatSlice';
import { connectionReducer } from './slices/connection/connectionSlice';
import { sessionActions, sessionReducer } from './slices/session/sessionSlice';

const appReducer = combineReducers({
    session: sessionReducer,
    connection: connectionReducer,
    chat: chatReducer,
});

// Выход обнуляет всё разом: чаты, баннеры, сессию.
export const rootReducer: typeof appReducer = (state, action) =>
    appReducer(sessionActions.loggedOut.match(action) ? undefined : state, action);
