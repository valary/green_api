import type { ApiError, ApiErrorKind } from '../../types/greenApi';
import axios from 'axios';
import { ERROR_TEXTS } from '../../shared/constants/texts';

export const isApiError = (e: unknown): e is ApiError =>
    typeof e === 'object' && e !== null && 'kind' in e && 'message' in e;

export const isFatal = (e: ApiError) => e.kind === 'unauthorized' || e.kind === 'forbidden';
export const isTransient = (e: ApiError) => e.kind === 'network' || e.kind === 'server';

const apiError = (
    kind: ApiErrorKind,
    status?: number,
    message: string = ERROR_TEXTS[kind as keyof typeof ERROR_TEXTS] as string,
) => ({
    kind,
    message,
    status,
});

const fromResponse = (status: number, data: unknown): ApiError => {
    const body = typeof data === 'string' ? data : JSON.stringify(data ?? '');
    const lower = body.toLowerCase();

    if (status === 401) return apiError('unauthorized', status);
    if (status === 403) return apiError('forbidden', status);
    if (status === 466) return apiError('quota', status);
    if (status === 429 || status === 469 || lower.includes('rate_limit_exceeded'))
        return apiError('rateLimit', status);
    if (status === 499 || status >= 500) return apiError('server', status);

    // Проблемы с инстансом GREEN-API отдаёт как 400 с текстом в теле.
    if (lower.includes('custom webhook url is set')) return apiError('webhookSet', status);
    if (lower.includes('not authorized') || lower.includes('starting')) {
        return apiError(
            'notAuthorized',
            status,
            ERROR_TEXTS.notAuthorized(lower.includes('starting') ? 'starting' : 'notAuthorized'),
        );
    }
    const details = typeof data === 'object' && data && 'message' in data ? String(data.message) : '';
    return apiError(
        'validation',
        status,
        ERROR_TEXTS.rejected(details ? `: ${details.slice(0, 200)}` : ` (код ${status})`),
    );
};

export const toApiError = (error: unknown): ApiError => {
    if (isApiError(error)) return error;
    if (axios.isCancel(error)) return apiError('aborted', undefined, '');
    if (axios.isAxiosError(error) && error.response)
        return fromResponse(error.response.status, error.response.data);
    return apiError('network');
};
