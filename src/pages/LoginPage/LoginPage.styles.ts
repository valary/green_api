import styled from 'styled-components';
import { mobile } from '@/theme/theme';
import { ChatBackground } from '@/shared/ui/ChatBackground/ChatBackground';

export const Page = styled(ChatBackground)`
    display: grid;
    place-items: center;
    min-height: 100%;
    padding: ${({ theme }) => `${theme.space[5]} ${theme.space[4]}`};

    ${mobile} {
        align-items: start;
        padding: ${({ theme }) => theme.space[4]};
    }
`;

export const Card = styled.section`
    display: grid;
    gap: ${({ theme }) => theme.space[3]};
    width: 100%;
    max-width: ${({ theme }) => theme.layout.card};
    padding: ${({ theme }) => theme.space[5]};
    border-radius: ${({ theme }) => theme.radius.xl};
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadow.high};

    ${mobile} {
        padding: ${({ theme }) => `${theme.space[5]} ${theme.space[4]} ${theme.space[4]}`};
    }
`;

export const Mark = styled.div`
    display: grid;
    place-items: center;
    justify-self: center;
    width: ${({ theme }) => theme.size.send};
    height: ${({ theme }) => theme.size.send};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.avatarGradients[5]};
    color: ${({ theme }) => theme.colors.onPrimary};
`;

export const Title = styled.h1`
    margin: 0;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSize.xl};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    line-height: ${({ theme }) => theme.lineHeight.tight};
`;

export const Lead = styled.p`
    margin: ${({ theme }) => `calc(${theme.space[2]} * -1) 0 ${theme.space[1]}`};
    text-align: center;
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: ${({ theme }) => theme.lineHeight.normal};
    color: ${({ theme }) => theme.colors.textMuted};
`;
