import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../Button/Button.styles'
import * as S from './Modal.styles'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

const focusable = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href]'

export function Modal({ title, onClose, children }: ModalProps) {
  const cardRef = useRef<HTMLElement>(null)

  // Когда модалка закроется, фокус вернётся туда, откуда её открыли.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    return () => opener?.focus()
  }, [])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') return onClose()
    if (event.key !== 'Tab' || !cardRef.current) return

    const items = [...cardRef.current.querySelectorAll<HTMLElement>(focusable)]
    const first = items[0]
    const last = items.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return createPortal(
    <S.Scrim onKeyDown={onKeyDown} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <S.Card ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <S.Head>
          <S.Title id="modal-title">{title}</S.Title>
          <IconButton aria-label="Закрыть" onClick={onClose}>
            <Icon name="close" />
          </IconButton>
        </S.Head>
        {children}
      </S.Card>
    </S.Scrim>,
    document.body,
  )
}
