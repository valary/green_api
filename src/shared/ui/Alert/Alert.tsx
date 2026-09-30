import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import * as S from './Alert.styles'

export function Alert({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <S.Alert role="alert">
      <Icon name="alert" />
      <div id={id}>{children}</div>
    </S.Alert>
  )
}
