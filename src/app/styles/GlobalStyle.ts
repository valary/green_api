import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
    margin: 0;
  }

  body {
    font-family: ${({ theme }) => theme.font.sans};
    font-size: ${({ theme }) => theme.fontSize.md};
    line-height: ${({ theme }) => theme.lineHeight.bubble};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bg};
    color-scheme: ${({ theme }) => theme.name};
    -webkit-font-smoothing: antialiased;
  }

  button,
  input,
  textarea {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  :focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.focusRing};
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  }
`
