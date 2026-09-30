import styled from 'styled-components';
import { mobile } from '../../theme/theme';

export const SidebarPanel = styled.aside`
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};

    ${mobile} {
        border-right: 0;
    }
`;

export const SidebarHeader = styled.header`
    flex: none;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
    height: ${({ theme }) => theme.size.header};
    padding: ${({ theme }) => `0 ${theme.space[2]} 0 ${theme.space[4]}`};
`;

export const SidebarTitle = styled.h1`
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export const HeaderSpacer = styled.span`
    flex: 1;
`;

export const ChatList = styled.ul`
    flex: 1;
    margin: 0;
    padding: ${({ theme }) => `0 ${theme.space[2]} calc(${theme.size.fab} + ${theme.space[6]})`};
    overflow-y: auto;
    list-style: none;
`;

export const NewChatFab = styled.button.attrs({ type: 'button' })`
    position: absolute;
    right: ${({ theme }) => theme.space[5]};
    bottom: ${({ theme }) => theme.space[5]};
    display: grid;
    place-items: center;
    width: ${({ theme }) => theme.size.fab};
    height: ${({ theme }) => theme.size.fab};
    border: 0;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primaryFill};
    color: ${({ theme }) => theme.colors.onPrimary};
    box-shadow: ${({ theme }) => theme.shadow.mid};
    transition: transform ${({ theme }) => theme.duration.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.primaryFillHover};
    }

    &:active {
        transform: scale(0.94);
    }

    ${mobile} {
        right: ${({ theme }) => theme.space[4]};
        bottom: ${({ theme }) => theme.space[4]};
    }
`;

export const EmptyChats = styled.div`
    flex: 1;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: ${({ theme }) => theme.space[3]};
    padding: ${({ theme }) => `${theme.space[6]} ${theme.space[5]}`};
    text-align: center;

    h2 {
        margin: 0;
        font-size: ${({ theme }) => theme.fontSize.lg};
        font-weight: ${({ theme }) => theme.fontWeight.medium};
    }

    p {
        max-width: 28ch;
        margin: 0;
        line-height: ${({ theme }) => theme.lineHeight.normal};
        color: ${({ theme }) => theme.colors.textMuted};
    }
`;

export const EmptyChatsArt = styled.div`
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};

    svg {
        width: 44px;
        height: 44px;
        stroke-width: 1.6;
    }
`;
