import styled from 'styled-components';
import { mobile } from '@/shared/theme';

export const Form = styled.form`
    flex: none;
    padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]} max(${theme.space[4]}, env(safe-area-inset-bottom))`};

    ${mobile} {
        padding-inline: ${({ theme }) => theme.space[2]};
    }
`;

export const Note = styled.div`
    max-width: ${({ theme }) => theme.layout.chatMax};
    margin: ${({ theme }) => `0 auto ${theme.space[2]}`};
`;

export const Inner = styled.div`
    display: flex;
    align-items: flex-end;
    gap: ${({ theme }) => theme.space[2]};
    max-width: ${({ theme }) => theme.layout.chatMax};
    margin: 0 auto;
`;

export const Box = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    min-height: ${({ theme }) => theme.size.composer};
    padding: 0 ${({ theme }) => theme.space[4]};
    border-radius: ${({ theme }) => theme.radius.xl};
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadow.low};

    &:focus-within {
        box-shadow: ${({ theme }) => `${theme.shadow.low}, 0 0 0 2px ${theme.colors.focus}`};
    }

    textarea {
        flex: 1;
        min-width: 0;
        padding: ${({ theme }) => theme.space[3]} 0;
        border: 0;
        outline: none;
        background: transparent;
        line-height: ${({ theme }) => theme.lineHeight.bubble};
        resize: none;

        &:focus-visible {
            box-shadow: none;
        }

        &::placeholder {
            color: ${({ theme }) => theme.colors.textPlaceholder};
        }
    }
`;

export const Counter = styled.span<{ $over: boolean }>`
    flex: none;
    align-self: flex-start;
    padding: ${({ theme }) => `${theme.space[3]} 0 0 ${theme.space[2]}`};
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-variant-numeric: tabular-nums;
    font-weight: ${({ theme, $over }) => ($over ? theme.fontWeight.medium : theme.fontWeight.regular)};
    color: ${({ theme, $over }) => ($over ? theme.colors.dangerText : theme.colors.textMuted)};
`;

export const Send = styled.button<{ $ready: boolean }>`
    flex: none;
    display: grid;
    place-items: center;
    width: ${({ theme }) => theme.size.send};
    height: ${({ theme }) => theme.size.send};
    border: 0;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme, $ready }) => ($ready ? theme.colors.primaryFill : theme.colors.surface)};
    color: ${({ theme, $ready }) => ($ready ? theme.colors.onPrimary : theme.colors.textMuted)};
    box-shadow: ${({ theme }) => theme.shadow.low};
    cursor: ${({ $ready }) => ($ready ? 'pointer' : 'not-allowed')};
    transition: background-color ${({ theme }) => theme.duration.fast};
`;
