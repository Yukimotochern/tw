import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trpc } from '../../trpc/client';

interface AuthState {
  user?: {
    isMain: boolean;
  };
  loading: boolean;
}

const initialState: AuthState = {
  loading: true,
};

export const getAccountThunk = createAsyncThunk('auth/getAccount', async () => {
  const user = await trpc;
});
