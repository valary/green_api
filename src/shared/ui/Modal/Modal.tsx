import { useEffect, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../Button/Button.styles';
import { ModalScrim, ModalCard, ModalHead, ModalTitle } from './Modal.styles';

type Props = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

const focusable = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href]';

export const Modal = ({ title, onClose, children }: Props) => {
    const cardRef = useRef<HTMLElement>(null);

    // Когда модалка закроется, фокус вернётся туда, откуда её открыли.
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        return () => opener?.focus();
    }, []);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') return onClose();
        if (event.key !== 'Tab' || !cardRef.current) return;

        const items = [...cardRef.current.querySelectorAll<HTMLElement>(focusable)];
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    };

    return createPortal(
        <ModalScrim
            onKeyDown={onKeyDown}
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <ModalCard ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <ModalHead>
                    <ModalTitle id="modal-title">{title}</ModalTitle>
                    <IconButton aria-label="Закрыть" onClick={onClose}>
                        <Icon name="close" />
                    </IconButton>
                </ModalHead>
                {children}
            </ModalCard>
        </ModalScrim>,
        document.body,
    );
};
