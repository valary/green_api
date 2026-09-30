import styled from 'styled-components';
import { mobile } from '@/theme/theme';

export const PhoneForm = styled.form`
    display: grid;
    gap: ${({ theme }) => theme.space[4]};
`;

export const DialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.space[2]};

    ${mobile} {
        flex-direction: column-reverse;

        button {
            width: 100%;
        }
    }
`;
