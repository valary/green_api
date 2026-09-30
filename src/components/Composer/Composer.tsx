import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { MAX_MESSAGE_LENGTH } from '../../app/config';
import { useAppDispatch } from '../../hooks/redux';
import { Icon } from '../../shared/ui/Icon/Icon';
import { ServicePill } from '../../shared/ui/ChatBackground/ChatBackground';
import { VisuallyHidden } from '../../shared/ui/VisuallyHidden/VisuallyHidden';
import { sendMessage } from '../../app/store/slices/chat/thunks';
import {
    ComposerForm,
    TooLongNote,
    ComposerRow,
    MessageFieldBox,
    LengthCounter,
    SendButton,
} from './Composer.styles';
import { COMPOSER_TEXTS } from '../../shared/constants/texts';

const COUNTER_FROM = MAX_MESSAGE_LENGTH - 100;
const MAX_HEIGHT = 192;

const formatCount = (value: number) => value.toLocaleString('ru-RU');

type Props = { chatId: string };

export const Composer = ({ chatId }: Props) => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState('');
    const fieldRef = useRef<HTMLTextAreaElement>(null);
    const tooLong = text.length > MAX_MESSAGE_LENGTH;
    const canSend = text.trim() !== '' && !tooLong;

    useLayoutEffect(() => {
        const field = fieldRef.current;
        if (!field) return;
        field.style.height = 'auto';
        field.style.height = `${Math.min(field.scrollHeight, MAX_HEIGHT)}px`;
    }, [text]);

    // На телефоне не открываем клавиатуру сами — фокус ставим только при мыши.
    useEffect(() => {
        if (!window.matchMedia?.('(pointer: coarse)').matches) fieldRef.current?.focus();
    }, [chatId]);

    const send = () => {
        if (!canSend) return;
        void dispatch(sendMessage({ chatId, text }));
        setText('');
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        send();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
        event.preventDefault();
        send();
    };

    return (
        <ComposerForm onSubmit={onSubmit}>
            {tooLong && (
                <TooLongNote>
                    <ServicePill role="status">{COMPOSER_TEXTS.tooLong}</ServicePill>
                </TooLongNote>
            )}
            <ComposerRow>
                <MessageFieldBox>
                    <VisuallyHidden as="label" htmlFor="composer-field">
                        {COMPOSER_TEXTS.placeholder}
                    </VisuallyHidden>
                    <textarea
                        id="composer-field"
                        ref={fieldRef}
                        rows={1}
                        placeholder={COMPOSER_TEXTS.placeholder}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        onKeyDown={onKeyDown}
                        aria-describedby={text.length >= COUNTER_FROM ? 'composer-counter' : undefined}
                    />
                    {text.length >= COUNTER_FROM && (
                        <LengthCounter id="composer-counter" $over={tooLong}>
                            {formatCount(text.length)} / {formatCount(MAX_MESSAGE_LENGTH)}
                        </LengthCounter>
                    )}
                </MessageFieldBox>
                <SendButton
                    type="submit"
                    aria-label={COMPOSER_TEXTS.send}
                    aria-disabled={!canSend}
                    $ready={canSend}
                >
                    <Icon name="send" />
                </SendButton>
            </ComposerRow>
        </ComposerForm>
    );
};
