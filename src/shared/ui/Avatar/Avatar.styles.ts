import styled from 'styled-components';

export const Avatar = styled.span<{ $gradient: number; $small?: boolean }>`
    flex: none;
    display: grid;
    place-items: center;
    width: ${({ theme, $small }) => ($small ? theme.size.avatarSmall : theme.size.avatar)};
    height: ${({ theme, $small }) => ($small ? theme.size.avatarSmall : theme.size.avatar)};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme, $gradient }) => theme.avatarGradients[$gradient]};
    color: ${({ theme }) => theme.colors.onPrimary};
    font-size: ${({ theme, $small }) => ($small ? theme.fontSize.md : theme.fontSize.lg)};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    user-select: none;
`;
