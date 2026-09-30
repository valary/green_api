import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createStore } from '../src/app/store/store';
import type { AppStore } from '../src/app/store/store';
import { lightTheme } from '../src/theme/theme';

export const renderWithProviders = (ui: ReactElement, { store = createStore(), route = '/' } = {}) => {
    const view = render(
        <Provider store={store}>
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
            </ThemeProvider>
        </Provider>,
    );
    return { ...view, store: store as AppStore };
};
