import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';
import * as S from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: S.ButtonVariant;
    block?: boolean;
    loading?: boolean;
}

export function Button({ variant = 'plain', block, loading, children, ...props }: ButtonProps) {
    return (
        <S.Button type="button" $variant={variant} $block={block} aria-busy={loading || undefined} {...props}>
            {loading && <Spinner />}
            {children}
        </S.Button>
    );
}
