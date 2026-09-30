import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ApiError } from '../../types/greenApi';
import type { AppDispatch, RootState } from './store';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: ApiError;
}>();
