import styled from 'styled-components';
import { ChatBackground } from '@/shared/ui/ChatBackground/ChatBackground';

export const ChatWindowPanel = styled(ChatBackground).attrs({ as: 'section' })`
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
`;

export const NoChatPlaceholder = styled.div`
    flex: 1;
    display: grid;
    place-items: center;
    padding: ${({ theme }) => theme.space[4]};
`;
