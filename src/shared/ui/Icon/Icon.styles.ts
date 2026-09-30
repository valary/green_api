import styled from 'styled-components'

export const Svg = styled.svg<{ $small?: boolean }>`
  flex: none;
  width: ${({ theme, $small }) => ($small ? theme.size.iconSmall : theme.size.icon)};
  height: ${({ theme, $small }) => ($small ? theme.size.iconSmall : theme.size.icon)};
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`
