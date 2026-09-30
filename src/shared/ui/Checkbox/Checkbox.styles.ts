import styled from 'styled-components';

export const Label = styled.label`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[3]};
    padding: ${({ theme }) => `${theme.space[2]} ${theme.space[1]}`};
    cursor: pointer;

    input {
        flex: none;
        width: 20px;
        height: 20px;
        margin: ${({ theme }) => theme.space[0]} 0 0;
        accent-color: ${({ theme }) => theme.colors.primaryFill};
    }
`;

export const Text = styled.span`
    display: grid;
    gap: ${({ theme }) => theme.space[0]};
`;

export const Hint = styled.span`
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: ${({ theme }) => theme.lineHeight.tight};
    color: ${({ theme }) => theme.colors.textMuted};
`;
