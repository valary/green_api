import styled, { css } from 'styled-components';

export const FieldGroup = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.space[1]};
`;

export const FieldControl = styled.div<{ $invalid: boolean; $withAction: boolean }>`
    position: relative;

    input {
        width: 100%;
        height: ${({ theme }) => theme.size.field};
        padding: 0 ${({ theme }) => theme.space[4]};
        padding-right: ${({ theme, $withAction }) => ($withAction ? `calc(${theme.size.target} + ${theme.space[2]})` : undefined)};
        border: 1px solid ${({ theme }) => theme.colors.borderInput};
        border-radius: ${({ theme }) => theme.radius.md};
        background: ${({ theme }) => theme.colors.surface};
        font-size: ${({ theme }) => theme.fontSize.md};
        transition: border-color ${({ theme }) => theme.duration.fast};

        &:hover,
        &:focus-visible {
            border-color: ${({ theme }) => theme.colors.primary};
        }

        &:focus-visible {
            box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.primary};
        }

        &::placeholder {
            color: transparent;
        }

        &:focus::placeholder {
            color: ${({ theme }) => theme.colors.textPlaceholder};
        }

        &:disabled {
            opacity: ${({ theme }) => theme.disabledOpacity};
        }
    }

    label {
        position: absolute;
        top: 50%;
        left: ${({ theme }) => theme.space[3]};
        padding: 0 ${({ theme }) => theme.space[1]};
        transform: translateY(-50%);
        background: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.textMuted};
        pointer-events: none;
        transition: all ${({ theme }) => `${theme.duration.base} ${theme.easing.standard}`};
    }

    input:focus + label,
    input:not(:placeholder-shown) + label {
        top: 0;
        font-size: ${({ theme }) => theme.fontSize.sm};
    }

    input:focus + label {
        color: ${({ theme }) => theme.colors.primaryText};
    }

    ${({ $invalid, theme }) =>
        $invalid &&
        css`
            && input {
                border-color: ${theme.colors.danger};
                box-shadow: inset 0 0 0 1px ${theme.colors.danger};
            }

            && label {
                color: ${theme.colors.dangerText};
            }
        `}
`;

export const FieldAction = styled.div`
    position: absolute;
    top: 50%;
    right: ${({ theme }) => theme.space[1]};
    transform: translateY(-50%);
`;

export const FieldNote = styled.div<{ $error: boolean }>`
    padding: 0 ${({ theme }) => theme.space[4]};
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: ${({ theme }) => theme.lineHeight.tight};
    color: ${({ theme, $error }) => ($error ? theme.colors.dangerText : theme.colors.textMuted)};
`;
