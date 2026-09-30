import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import * as S from './TextField.styles';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    hint?: string;
    error?: string;
    action?: ReactNode;
    ref?: Ref<HTMLInputElement>;
}

// Метка «плавает» на рамке, как в Web K. Плейсхолдер виден только в фокусе.
export function TextField({ label, hint, error, action, placeholder = ' ', ...input }: TextFieldProps) {
    const id = useId();
    const noteId = `${id}-note`;
    const note = error ?? hint;

    return (
        <S.Field>
            <S.Control $invalid={Boolean(error)} $withAction={Boolean(action)}>
                <input
                    id={id}
                    placeholder={placeholder}
                    aria-invalid={error ? true : input['aria-invalid']}
                    aria-describedby={note ? noteId : undefined}
                    {...input}
                />
                <label htmlFor={id}>{label}</label>
                {action && <S.Action>{action}</S.Action>}
            </S.Control>
            {note && (
                <S.Note id={noteId} $error={Boolean(error)}>
                    {note}
                </S.Note>
            )}
        </S.Field>
    );
}
