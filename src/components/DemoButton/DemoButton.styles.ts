import styled from 'styled-components';

export const DemoSection = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.space[2]};
    text-align: center;
`;

export const OrDivider = styled.div`
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

export const DemoHint = styled.p`
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.textMuted};
`;
