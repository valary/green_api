import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useColorScheme } from '@/hooks/useColorScheme';
import { darkTheme, lightTheme } from '@/theme/theme';
import { router } from './router';
import { store } from '@/app/store/store';
import { GlobalStyle } from '@/theme/GlobalStyle';

export const App = () => {
    const scheme = useColorScheme();

    return (
        <Provider store={store}>
            <ThemeProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
                <GlobalStyle />
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    );
};
