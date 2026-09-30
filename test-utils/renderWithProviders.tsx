import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createStore, type AppStore } from '@/app/store/store';
import { lightTheme } from '@/theme/theme';

export function renderWithProviders(ui: ReactElement, { store = createStore(), route = '/' } = {}) {
    const view = render(
        <Provider store={store}>
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
            </ThemeProvider>
        </Provider>,
    );
    return { ...view, store: store as AppStore };
}
