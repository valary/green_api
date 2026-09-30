import { useAppSelector } from '../../hooks/redux';
import { selectIsDemo } from '../../app/store/selectors';
import { DemoBadgeLabel } from './DemoBadge.styles';
import { DEMO_TEXTS } from '../../shared/constants/texts';

type Props = { className?: string };

export const DemoBadge = ({ className }: Props) => {
    const isDemo = useAppSelector(selectIsDemo);
    if (!isDemo) return null;

    return (
        <DemoBadgeLabel className={className} title={DEMO_TEXTS.badgeTitle}>
            {DEMO_TEXTS.badge}
        </DemoBadgeLabel>
    );
};
