import type { ReactNode } from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import { AlertBox } from './Alert.styles';

type Props = { id?: string; children: ReactNode };

export const Alert = ({ id, children }: Props) => {
    return (
        <AlertBox role="alert">
            <Icon name="alert" />
            <div id={id}>{children}</div>
        </AlertBox>
    );
};
