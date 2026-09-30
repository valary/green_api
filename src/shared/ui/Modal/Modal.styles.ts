import styled, { keyframes } from 'styled-components'
import { mobile } from '@/shared/theme'

const fade = keyframes`
  from { opacity: 0; }
`

const pop = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
`

export const Scrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.scrim};
  animation: ${fade} ${({ theme }) => theme.duration.base};

  ${mobile} {
    align-items: end;
    padding: 0;
  }
`

export const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.card};
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.high};
  animation: ${pop} ${({ theme }) => `${theme.duration.base} ${theme.easing.out}`};

  ${mobile} {
    max-width: none;
    border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
    padding-bottom: max(${({ theme }) => theme.space[5]}, env(safe-area-inset-bottom));
  }
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin: ${({ theme }) => `calc(${theme.space[2]} * -1) calc(${theme.space[2]} * -1) 0 0`};
`

export const Title = styled.h2`
  flex: 1;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
