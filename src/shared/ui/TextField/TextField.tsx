import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { FieldGroup, FieldControl, FieldAction, FieldNote } from './TextField.styles';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: string;
    error?: string;
    action?: ReactNode;
    ref?: Ref<HTMLInputElement>;
};

// Метка «плавает» на рамке, как в Web K. Плейсхолдер виден только в фокусе.
export const TextField = ({ label, hint, error, action, placeholder = ' ', ...input }: Props) => {
    const id = useId();
    const noteId = `${id}-note`;
    const note = error ?? hint;

    return (
        <FieldGroup>
            <FieldControl $invalid={Boolean(error)} $withAction={Boolean(action)}>
                <input
                    id={id}
                    placeholder={placeholder}
                    aria-invalid={error ? true : input['aria-invalid']}
                    aria-describedby={note ? noteId : undefined}
                    {...input}
                />
                <label htmlFor={id}>{label}</label>
                {action && <FieldAction>{action}</FieldAction>}
            </FieldControl>
            {note && (
                <FieldNote id={noteId} $error={Boolean(error)}>
                    {note}
                </FieldNote>
            )}
        </FieldGroup>
    );
};
