import styled from 'styled-components';
import { mobile } from '@/shared/theme';

export const Feed = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: ${({ theme }) => `${theme.space[4]} ${theme.space[4]} ${theme.space[2]}`};
    overflow-y: auto;
    overscroll-behavior: contain;

    ${mobile} {
        padding: ${({ theme }) => `${theme.space[3]} ${theme.space[2]} ${theme.space[2]}`};
    }
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[0]};
    width: 100%;
    max-width: ${({ theme }) => theme.layout.chatMax};
    margin: auto auto 0;
`;

export const EmptyCard = styled.div`
    align-self: center;
    display: grid;
    gap: ${({ theme }) => theme.space[1]};
    max-width: 30ch;
    padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
    border-radius: ${({ theme }) => theme.radius.xl};
    background: ${({ theme }) => theme.colors.serviceBg};
    color: ${({ theme }) => theme.colors.serviceText};
    text-align: center;
    line-height: ${({ theme }) => theme.lineHeight.normal};
    backdrop-filter: blur(8px);

    strong {
        font-weight: ${({ theme }) => theme.fontWeight.medium};
    }

    span {
        font-size: ${({ theme }) => theme.fontSize.sm};
    }
`;
