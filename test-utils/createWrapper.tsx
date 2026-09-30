import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from '../src/app/store/store';

export const createWrapper = ({ store = createStore(), route = '/' } = {}) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </Provider>
    );
    return { wrapper, store };
};
