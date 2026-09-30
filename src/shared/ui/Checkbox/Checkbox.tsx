import type { InputHTMLAttributes, Ref } from 'react';
import * as S from './Checkbox.styles';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    hint?: string;
    ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ label, hint, ...input }: CheckboxProps) {
    return (
        <S.Label>
            <input type="checkbox" {...input} />
            <S.Text>
                <span>{label}</span>
                {hint && <S.Hint>{hint}</S.Hint>}
            </S.Text>
        </S.Label>
    );
}
