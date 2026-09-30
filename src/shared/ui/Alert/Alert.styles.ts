import styled from 'styled-components';

export const AlertBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[3]};
    padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.dangerSoft};
    color: ${({ theme }) => theme.colors.dangerText};
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: ${({ theme }) => theme.lineHeight.normal};

    svg {
        color: ${({ theme }) => theme.colors.danger};
    }
`;
