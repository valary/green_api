import styled from 'styled-components'

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => `${theme.space[0]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.warningSoft};
  color: ${({ theme }) => theme.colors.warningText};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  white-space: nowrap;

  &::before {
    content: '';
    width: ${({ theme }) => theme.space[2]};
    height: ${({ theme }) => theme.space[2]};
    border-radius: ${({ theme }) => theme.radius.full};
    background: currentColor;
  }
`
