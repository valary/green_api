import styled, { css, type DefaultTheme } from 'styled-components';

type Tone = 'danger' | 'warning' | 'neutral';

const tones: Record<Tone, (theme: DefaultTheme) => ReturnType<typeof css>> = {
    danger: (theme) => css`
        background: ${theme.colors.dangerSoft};
        color: ${theme.colors.dangerText};

        > svg {
            color: ${theme.colors.danger};
        }
    `,
    warning: (theme) => css`
        background: ${theme.colors.warningSoft};
        color: ${theme.colors.warningText};

        > svg {
            color: ${theme.colors.warningIcon};
        }

        button {
            color: inherit;
        }
    `,
    neutral: (theme) => css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};

        > span:first-child {
            color: ${theme.colors.primary};
        }
    `,
};

export const BannerStack = styled.div`
    grid-column: 1 / -1;
    display: grid;
`;

export const ConnectionBanner = styled.div<{ $tone: Tone }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[3]};
    min-height: ${({ theme }) => theme.size.target};
    padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: ${({ theme }) => theme.lineHeight.normal};

    ${({ theme, $tone }) => tones[$tone](theme)}

    button {
        flex: none;
        min-height: 36px;
        padding: 0 ${({ theme }) => theme.space[3]};
    }
`;

export const BannerText = styled.span`
    flex: 1;
    min-width: 0;
`;
