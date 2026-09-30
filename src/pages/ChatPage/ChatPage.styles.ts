import styled from 'styled-components';
import { mobile } from '@/theme/theme';

export const Layout = styled.div<{ $chatOpen: boolean }>`
    display: grid;
    grid-template-columns: min(${({ theme }) => theme.layout.sidebar}, 42%) 1fr;
    grid-template-rows: auto 1fr;
    height: 100dvh;

    ${mobile} {
        grid-template-columns: 1fr;

        & > :nth-child(2) {
            display: ${({ $chatOpen }) => ($chatOpen ? 'none' : 'flex')};
        }

        & > :last-child {
            display: ${({ $chatOpen }) => ($chatOpen ? 'flex' : 'none')};
        }
    }
`;
