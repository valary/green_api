import type { InputHTMLAttributes, Ref } from 'react';
import { CheckboxLabel, CheckboxText, CheckboxHint } from './Checkbox.styles';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string;
    hint?: string;
    ref?: Ref<HTMLInputElement>;
};

export const Checkbox = ({ label, hint, ...input }: Props) => {
    return (
        <CheckboxLabel>
            <input type="checkbox" {...input} />
            <CheckboxText>
                <span>{label}</span>
                {hint && <CheckboxHint>{hint}</CheckboxHint>}
            </CheckboxText>
        </CheckboxLabel>
    );
};
