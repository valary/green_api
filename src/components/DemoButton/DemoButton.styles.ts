import styled from 'styled-components';

export const Demo = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.space[2]};
    text-align: center;
`;

export const Divider = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.textMuted};

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: ${({ theme }) => theme.colors.border};
    }
`;

export const Hint = styled.p`
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.textMuted};
`;
