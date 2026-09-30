import { useAppSelector } from '@/hooks/redux';
import { selectIsDemo } from '@/app/store/selectors';
import { DemoBadgeLabel } from './DemoBadge.styles';

type Props = { className?: string };

export const DemoBadge = ({ className }: Props) => {
    const isDemo = useAppSelector(selectIsDemo);
    if (!isDemo) return null;

    return (
        <DemoBadgeLabel className={className} title="Данные не уходят в GREEN-API — это имитация">
            Демо
        </DemoBadgeLabel>
    );
};
