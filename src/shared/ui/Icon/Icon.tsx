import * as S from './Icon.styles'

// Свои иконки в духе прототипа дизайнера: линия 2px, скругления. Ассетов Telegram нет.
const paths = {
  edit: ['M4 20h4L19 9l-4-4L4 16v4z', 'M13.5 6.5l4 4'],
  send: ['M5 12h13', 'M12.5 6l6 6-6 6'],
  back: ['M19 12H6', 'M11.5 6l-6 6 6 6'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  checks: ['M1.5 12.5L6 17l9.5-9.5', 'M11 16l1 1 9.5-9.5'],
  clock: ['M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z', 'M12 8v4.5l3 1.5'],
  alert: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7.5v5.5', 'M12 16.5v.1'],
  warn: ['M12 3.5l9.5 16.5h-19z', 'M12 10v4.5', 'M12 17.5v.1'],
  eye: [
    'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z',
    'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  ],
  eyeOff: [
    'M4 4l16 16',
    'M9.5 6A9.6 9.6 0 0112 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 01-2.7 3.4M6.2 7.6A16 16 0 002.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.2-1',
    'M10 10a3 3 0 004 4',
  ],
  logout: ['M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4', 'M9.5 8l-4 4 4 4', 'M5.5 12H15'],
  close: ['M6 6l12 12M18 6L6 18'],
  bubble: [
    'M5 5.5h14a2 2 0 012 2v8a2 2 0 01-2 2H11l-5 3.5v-3.5H5a2 2 0 01-2-2v-8a2 2 0 012-2z',
    'M7.5 10h9M7.5 13.5h5.5',
  ],
}

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  small?: boolean
  label?: string
  className?: string
}

export function Icon({ name, small, label, className }: IconProps) {
  return (
    <S.Svg
      viewBox="0 0 24 24"
      $small={small}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </S.Svg>
  )
}
