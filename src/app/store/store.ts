import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

export const createStore = (preloadedState?: Partial<RootState>) =>
    configureStore({ reducer: rootReducer, preloadedState, devTools: import.meta.env.DEV });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
