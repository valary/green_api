import styled from 'styled-components';

// Свой узор (кольца, плюсы, облачко, волна) рисуется маской цветом темы — узор Telegram не используем.
const pattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='16' cy='18' r='5'/%3E%3Cpath d='M62 8v12M56 14h12'/%3E%3Crect x='18' y='50' width='24' height='15' rx='7'/%3E%3Cpath d='M24 65l-3 5 7-5'/%3E%3Cpath d='M52 82q5-6 10 0t10 0'/%3E%3Ccircle cx='84' cy='44' r='2' fill='black'/%3E%3Ccircle cx='8' cy='86' r='2' fill='black'/%3E%3Ccircle cx='86' cy='88' r='3'/%3E%3Cpath d='M76 22l6 6M82 22l-6 6'/%3E%3C/svg%3E")`;

export const ChatBackground = styled.div`
    position: relative;
    isolation: isolate;
    background:
        radial-gradient(circle at 0% 0%, ${({ theme }) => theme.colors.chatBg[0]} 0, transparent 55%),
        radial-gradient(circle at 100% 30%, ${({ theme }) => theme.colors.chatBg[2]} 0, transparent 50%),
        radial-gradient(circle at 20% 100%, ${({ theme }) => theme.colors.chatBg[3]} 0, transparent 60%),
        ${({ theme }) => theme.colors.chatBg[1]};

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background-color: ${({ theme }) => theme.colors.chatPattern};
        opacity: ${({ theme }) => theme.patternOpacity};
        mask: ${pattern} repeat 0 0 / 128px;
    }
`;

export const ServicePill = styled.div`
    align-self: center;
    margin: ${({ theme }) => theme.space[2]} 0;
    padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.serviceBg};
    color: ${({ theme }) => theme.colors.serviceText};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    backdrop-filter: blur(8px);
`;
