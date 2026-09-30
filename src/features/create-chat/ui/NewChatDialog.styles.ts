import styled from 'styled-components'
import { mobile } from '@/shared/theme'

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};

  ${mobile} {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`
