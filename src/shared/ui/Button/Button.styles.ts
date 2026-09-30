import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'text' | 'plain';

const variants = {
    primary: css`
        background: ${({ theme }) => theme.colors.primaryFill};
        color: ${({ theme }) => theme.colors.onPrimary};

        &:hover {
            background: ${({ theme }) => theme.colors.primaryFillHover};
        }
    `,
    text: css`
        color: ${({ theme }) => theme.colors.primaryText};

        &:hover {
            background: ${({ theme }) => theme.colors.primarySoft};
        }
    `,
    plain: css`
        color: ${({ theme }) => theme.colors.textMuted};

        &:hover {
            background: ${({ theme }) => theme.colors.surfaceHover};
        }
    `,
};

export const ButtonControl = styled.button<{ $variant: ButtonVariant; $block?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.space[2]};
    width: ${({ $block }) => ($block ? '100%' : 'auto')};
    min-height: ${({ theme }) => theme.size.target};
    padding: 0 ${({ theme }) => theme.space[4]};
    border: 0;
    border-radius: ${({ theme }) => theme.radius.md};
    background: transparent;
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    transition: background-color ${({ theme }) => `${theme.duration.fast} ${theme.easing.standard}`};

    ${({ $variant }) => variants[$variant]}

    &:disabled,
  &[aria-disabled='true'] {
        opacity: ${({ theme }) => theme.disabledOpacity};
        cursor: not-allowed;
    }

    &[aria-busy='true'] {
        cursor: progress;
    }
`;

export const IconButton = styled.button.attrs({ type: 'button' })`
    display: inline-grid;
    place-items: center;
    width: ${({ theme }) => theme.size.target};
    height: ${({ theme }) => theme.size.target};
    padding: 0;
    border: 0;
    border-radius: ${({ theme }) => theme.radius.full};
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};

    &:hover {
        background: ${({ theme }) => theme.colors.surfaceHover};
    }
`;
