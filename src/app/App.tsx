import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useColorScheme } from '@/shared/lib/useColorScheme';
import { darkTheme, lightTheme } from '@/shared/theme';
import { router } from './router/router';
import { store } from './store';
import { GlobalStyle } from './styles/GlobalStyle';

export function App() {
    const scheme = useColorScheme();

    return (
        <Provider store={store}>
            <ThemeProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
                <GlobalStyle />
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    );
}
