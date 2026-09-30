import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectDemoStatus } from '../app/store/selectors';
import { openDemo } from '../app/store/slices/session/thunks';
import { parseDemoScenario } from '../shared/utils/demoScenario';
import { useAppDispatch, useAppSelector } from './redux';

export const useOpenDemo = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = useAppSelector(selectDemoStatus);
    const autoOpened = useRef(false);
    const scenario = parseDemoScenario(searchParams.get('demo'));

    const open = async () => {
        const result = await dispatch(openDemo(scenario));
        if (openDemo.fulfilled.match(result)) navigate('/chat');
    };

    // Ссылка вида ?demo=offline сразу открывает нужный сценарий — удобно давать ревьюеру.
    useEffect(() => {
        if (!searchParams.has('demo') || autoOpened.current) return;
        autoOpened.current = true;
        void open();
    });

    return { scenario, status, open };
};
