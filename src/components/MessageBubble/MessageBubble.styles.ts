import styled, { css } from 'styled-components';
import { mobile } from '../../theme/theme';

// Хвост пузыря — своя форма 11×20, накладывается маской цветом пузыря.
const tailOut = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 20'%3E%3Cpath d='M0 0C0 9 3 16 11 20H0Z'/%3E%3C/svg%3E")`;
const tailIn = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 20'%3E%3Cpath d='M11 0C11 9 8 16 0 20H11Z'/%3E%3C/svg%3E")`;

type Side = { $outgoing: boolean };
type Position = Side & { $first: boolean; $last: boolean };

export const MessageRow = styled.div<Side & { $first: boolean }>`
    display: flex;
    align-items: flex-end;
    justify-content: ${({ $outgoing }) => ($outgoing ? 'flex-end' : 'flex-start')};
    gap: ${({ theme }) => theme.space[2]};
    margin-top: ${({ theme, $first }) => ($first ? theme.space[2] : 0)};
`;

export const BubbleBody = styled.div<Position>`
    position: relative;
    max-width: min(480px, 85%);
    padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
    border-radius: ${({ theme }) => theme.radius.bubble};
    box-shadow: ${({ theme }) => theme.shadow.bubble};
    line-height: ${({ theme }) => theme.lineHeight.bubble};
    overflow-wrap: anywhere;
    white-space: pre-wrap;

    ${({ theme, $outgoing, $first, $last }) => {
        const side = $outgoing ? 'right' : 'left';
        const color = $outgoing ? theme.colors.bubbleOut : theme.colors.bubbleIn;
        return css`
      margin-${side}: ${theme.size.tailWidth};
      background: ${color};
      color: ${$outgoing ? theme.colors.bubbleOutText : theme.colors.bubbleInText};
      border-top-${side}-radius: ${$first ? theme.radius.bubble : theme.radius.bubbleInner};
      border-bottom-${side}-radius: ${$last ? 0 : theme.radius.bubbleInner};

      a {
        color: ${$outgoing ? theme.colors.bubbleOutLink : theme.colors.textLink};
      }

      ${
          $last &&
          css`
              &::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  ${side}: calc(${theme.size.tailWidth} * -1);
                  width: ${theme.size.tailWidth};
                  height: ${theme.size.tailHeight};
                  background: ${color};
                  mask: ${$outgoing ? tailOut : tailIn} no-repeat;
              }
          `
      }
    `;
    }}

    ${mobile} {
        max-width: 88%;
    }
`;

// Невидимый хвост текста резервирует место под время, чтобы оно не наезжало на последнюю строку.
export const MetaSpacer = styled.span<Side>`
    display: inline-block;
    width: ${({ $outgoing }) => ($outgoing ? '64px' : '44px')};
    height: 1px;
`;

export const MessageMeta = styled.span<Side>`
    position: absolute;
    right: ${({ theme }) => theme.space[2]};
    bottom: ${({ theme }) => theme.space[1]};
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[0]};
    font-size: ${({ theme }) => theme.fontSize.xs};
    line-height: 1;
    white-space: nowrap;
    color: ${({ theme, $outgoing }) => ($outgoing ? theme.colors.bubbleOutMeta : theme.colors.bubbleInMeta)};
`;

export const RetryDot = styled.button.attrs({ type: 'button' })`
    position: relative;
    flex: none;
    display: grid;
    place-items: center;
    width: ${({ theme }) => theme.size.icon};
    height: ${({ theme }) => theme.size.icon};
    margin-bottom: ${({ theme }) => theme.space[1]};
    padding: 0;
    border: 0;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.onPrimary};
    font-weight: ${({ theme }) => theme.fontWeight.medium};

    &::before {
        content: '';
        position: absolute;
        inset: -10px;
    }
`;

export const SendFailure = styled.div`
    align-self: flex-end;
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
    margin: ${({ theme }) => `${theme.space[1]} ${theme.size.tailWidth} ${theme.space[1]} 0`};
    padding: ${({ theme }) => `${theme.space[1]} ${theme.space[1]} ${theme.space[1]} ${theme.space[3]}`};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.serviceBg};
    color: ${({ theme }) => theme.colors.serviceText};
    font-size: ${({ theme }) => theme.fontSize.sm};
    backdrop-filter: blur(8px);

    button {
        min-height: 32px;
        padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
        border: 0;
        border-radius: ${({ theme }) => theme.radius.full};
        background: transparent;
        font-weight: ${({ theme }) => theme.fontWeight.medium};
        text-decoration: underline;
        text-underline-offset: 2px;
    }
`;
