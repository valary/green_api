import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { selectSession } from '@/app/store/selectors';
import { useAppSelector } from '@/hooks/redux';

type Props = { children: ReactNode };

export const RequireSession = ({ children }: Props) => {
    const session = useAppSelector(selectSession);
    return session ? children : <Navigate to="/" replace />;
};

export const GuestOnly = ({ children }: Props) => {
    const session = useAppSelector(selectSession);
    return session ? <Navigate to="/chat" replace /> : children;
};
