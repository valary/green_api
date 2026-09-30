// Палитра дизайнера (Web K с поправками под контраст AA), светлая и тёмная.
export const lightColors = {
    primary: '#3390ec',
    primaryFill: '#2a78c6',
    primaryFillHover: '#2468ad',
    onPrimary: '#ffffff',
    primaryText: '#2468ad',
    primarySoft: '#eef6fd',

    bg: '#f4f4f5',
    surface: '#ffffff',
    surfaceHover: '#f4f4f5',
    surfacePressed: '#e9eaec',

    text: '#000000',
    textMuted: '#686d72',
    textPlaceholder: '#909499',
    textLink: '#00488f',

    border: '#dfe1e5',
    borderInput: '#909499',
    focus: '#3390ec',

    danger: '#df3f40',
    dangerText: '#c0302f',
    dangerSoft: '#fef1f1',
    warningText: '#7a5200',
    warningIcon: '#a36d00',
    warningSoft: '#fff5dc',

    bubbleOut: '#e3fee0',
    bubbleOutText: '#000000',
    bubbleOutMeta: '#447d3e',
    bubbleOutLink: '#00488f',
    bubbleIn: '#ffffff',
    bubbleInText: '#000000',
    bubbleInMeta: '#686d72',

    serviceBg: 'rgba(40, 74, 52, 0.72)',
    serviceText: '#ffffff',
    scrim: 'rgba(0, 0, 0, 0.4)',

    chatBg: ['#dbddbb', '#6ba587', '#d5d88d', '#88b884'],
    chatPattern: '#1d3a26',
};

export type Colors = typeof lightColors;

export const darkColors: Colors = {
    ...lightColors,
    primary: '#8774e1',
    primaryFill: '#7163c4',
    primaryFillHover: '#6456b5',
    primaryText: '#9a8ae6',
    primarySoft: '#2b2740',

    bg: '#181818',
    surface: '#212121',
    surfaceHover: '#2c2c2c',
    surfacePressed: '#353535',

    text: '#ffffff',
    textMuted: '#aaaaaa',
    textPlaceholder: '#7d7d7d',
    textLink: '#a99cf0',

    border: '#303030',
    borderInput: '#6e6e6e',
    focus: '#8774e1',

    danger: '#ff595a',
    dangerText: '#ff6b6c',
    dangerSoft: '#3a1f20',
    warningText: '#ffd580',
    warningIcon: '#ffc24d',
    warningSoft: '#3a3020',

    bubbleOut: '#7163c4',
    bubbleOutText: '#ffffff',
    bubbleOutMeta: '#ffffff',
    bubbleOutLink: '#ffffff',
    bubbleIn: '#212121',
    bubbleInText: '#ffffff',
    bubbleInMeta: '#aaaaaa',

    serviceBg: 'rgba(0, 0, 0, 0.45)',
    scrim: 'rgba(0, 0, 0, 0.6)',

    chatBg: ['#1b1830', '#2c2350', '#15202a', '#3a2a48'],
    chatPattern: '#c9bfff',
};
