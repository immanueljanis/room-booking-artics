import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/apiRequest';

export const fetchWhoAmI = createAsyncThunk(
    'user/fetchWhoAmI',
    async (_, { rejectWithValue }) => {
        try {
            const user = await apiRequest({
                url: '/auth/whoami',
                method: 'GET',
                needAuth: true,
            });
            return user;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearUser(state) {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchWhoAmI.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWhoAmI.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.data = payload;
            })
            .addCase(fetchWhoAmI.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
                state.data = null;
            });
    }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
