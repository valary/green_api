import { ThemeProvider } from 'styled-components'
import { useColorScheme } from '@/shared/lib/useColorScheme'
import { darkTheme, lightTheme } from '@/shared/theme'
import { GlobalStyle } from './styles/GlobalStyle'

export function App() {
  const scheme = useColorScheme()

  return (
    <ThemeProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle />
      <h1>GREEN-API Telegram Chat</h1>
    </ThemeProvider>
  )
}
