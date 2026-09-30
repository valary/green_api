import styled, { css } from 'styled-components';
import { DeliveryMark } from '@/entities/message';

export const Item = styled.button<{ $current: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[3]};
    width: 100%;
    padding: ${({ theme }) => theme.space[2]};
    border: 0;
    border-radius: ${({ theme }) => theme.radius.md};
    background: transparent;
    text-align: left;
    transition: background-color ${({ theme }) => theme.duration.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.surfaceHover};
    }

    ${({ $current, theme }) =>
        $current &&
        css`
            &&,
            && * {
                color: ${theme.colors.onPrimary};
            }

            && {
                background: ${theme.colors.primaryFill};
            }
        `}
`;

export const Body = styled.span`
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[0]};
`;

export const Line = styled.span`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
`;

const ellipsis = css`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const Name = styled.span`
    ${ellipsis}
    font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export const Time = styled.span`
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[0]};
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const Mark = styled(DeliveryMark)`
    color: ${({ theme, status }) => (status === 'error' ? theme.colors.danger : theme.colors.primaryText)};
`;

export const Preview = styled.span`
    ${ellipsis}
    color: ${({ theme }) => theme.colors.textMuted};

    em {
        font-style: normal;
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const Unread = styled.span`
    display: inline-grid;
    place-items: center;
    min-width: ${({ theme }) => theme.space[5]};
    height: ${({ theme }) => theme.space[5]};
    padding: 0 ${({ theme }) => theme.space[2]};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primaryFill};
    color: ${({ theme }) => theme.colors.onPrimary};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
`;
