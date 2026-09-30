import { darkColors, lightColors } from './colors';
import type { Colors } from './colors';

const scale = {
    font: {
        sans: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    },
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem', xl: '1.5rem' },
    lineHeight: { bubble: 1.3125, tight: 1.25, normal: 1.4 },
    fontWeight: { regular: 400, medium: 500 },
    space: ['2px', '4px', '8px', '12px', '16px', '24px', '32px', '48px'],
    radius: {
        bubble: '15px',
        bubbleInner: '5px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '999px',
    },
    size: {
        composer: '48px',
        send: '48px',
        fab: '54px',
        avatar: '54px',
        avatarSmall: '40px',
        header: '56px',
        icon: '24px',
        iconSmall: '16px',
        tailWidth: '11px',
        tailHeight: '20px',
        target: '44px',
        field: '54px',
    },
    layout: { sidebar: '360px', chatMax: '696px', card: '400px' },
    duration: { fast: '120ms', base: '200ms' },
    easing: { standard: 'cubic-bezier(0.2, 0, 0, 1)', out: 'cubic-bezier(0.25, 1, 0.5, 1)' },
    zIndex: { sticky: 100, modal: 1000 },
    avatarGradients: [
        'linear-gradient(#ff885e, #ff516a)',
        'linear-gradient(#ffcd6a, #ffa85c)',
        'linear-gradient(#82b1ff, #665fff)',
        'linear-gradient(#a0de7e, #54cb68)',
        'linear-gradient(#53edd6, #28c9b7)',
        'linear-gradient(#72d5fd, #2a9ef1)',
        'linear-gradient(#e0a2f3, #d669ed)',
    ],
    disabledOpacity: 0.45,
};

const createTheme = (name: 'light' | 'dark', colors: Colors) => {
    const shadowColor = name === 'light' ? 'rgba(16, 35, 47,' : 'rgba(0, 0, 0,';
    return {
        ...scale,
        name,
        colors,
        shadow: {
            bubble: `0 1px 2px ${shadowColor} ${name === 'light' ? 0.15 : 0.35})`,
            low: `0 1px 2px ${shadowColor} ${name === 'light' ? 0.15 : 0.4})`,
            mid: `0 2px 8px ${shadowColor} ${name === 'light' ? 0.16 : 0.45})`,
            high: `0 8px 32px ${shadowColor} ${name === 'light' ? 0.24 : 0.6})`,
        },
        focusRing: `0 0 0 2px ${colors.surface}, 0 0 0 4px ${colors.focus}`,
        patternOpacity: name === 'light' ? 0.09 : 0.07,
    };
};

export const lightTheme = createTheme('light', lightColors);
export const darkTheme = createTheme('dark', darkColors);

export type AppTheme = typeof lightTheme;

// В @media переменные не работают, поэтому брейкпоинт — строкой.
export const mobile = '@media (max-width: 599.98px)';
