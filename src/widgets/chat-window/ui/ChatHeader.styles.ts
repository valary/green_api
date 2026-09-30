import styled, { css } from 'styled-components'
import { mobile } from '@/shared/theme'
import { IconButton } from '@/shared/ui'

export const Header = styled.header`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  flex: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  height: ${({ theme }) => theme.size.header};
  padding: 0 ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const Back = styled(IconButton)`
  display: none;
  margin-left: ${({ theme }) => `calc(${theme.space[2]} * -1)`};

  ${mobile} {
    display: inline-grid;
  }
`

export const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
`

const ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Name = styled.h2`
  ${ellipsis}
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export const Subtitle = styled.span`
  ${ellipsis}
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const MobileBadge = styled.span`
  display: none;

  ${mobile} {
    display: contents;
  }
`
