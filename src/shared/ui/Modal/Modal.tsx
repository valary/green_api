import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../Button/Button.styles';
import { ModalScrim, ModalCard, ModalHead, ModalTitle } from './Modal.styles';
import { COMMON_TEXTS } from '../../constants/texts';

type Props = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export const Modal = ({ title, onClose, children }: Props) => {
    const { containerRef, onKeyDown } = useFocusTrap(onClose);

    return createPortal(
        <ModalScrim
            onKeyDown={onKeyDown}
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <ModalCard ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <ModalHead>
                    <ModalTitle id="modal-title">{title}</ModalTitle>
                    <IconButton aria-label={COMMON_TEXTS.close} onClick={onClose}>
                        <Icon name="close" />
                    </IconButton>
                </ModalHead>
                {children}
            </ModalCard>
        </ModalScrim>,
        document.body,
    );
};
