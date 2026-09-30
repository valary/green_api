import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const Spinner = styled.span.attrs({ 'aria-hidden': true })`
  flex: none;
  width: ${({ theme }) => theme.size.iconSmall};
  height: ${({ theme }) => theme.size.iconSmall};
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 800ms linear infinite;
`
