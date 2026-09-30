import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { ButtonControl } from './Button.styles';
import type { ButtonVariant } from './Button.styles';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    block?: boolean;
    loading?: boolean;
};

export const Button = ({ variant = 'plain', block, loading, children, ...props }: Props) => {
    return (
        <ButtonControl
            type="button"
            $variant={variant}
            $block={block}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading && <Spinner />}
            {children}
        </ButtonControl>
    );
};
