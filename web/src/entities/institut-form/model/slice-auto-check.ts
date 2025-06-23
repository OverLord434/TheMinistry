import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CheckAutomaticRun } from "./actions/send-message";

type FailedChecks = {
    organization: string;
    reason: string;
    type: string;
    url: string;
}

type InstitutionAutoCheck = {
    status: string;
    successfully_checked: number;
    total_organizations: number;
    invalid_urls: number;
    failed_checks: FailedChecks[];
}

type InstitutionState = {
    data: InstitutionAutoCheck;
    loading: boolean;
    error: string | null;
}

const initialState: InstitutionState = {
    data: {
        status: "",
        successfully_checked: 0,
        total_organizations: 0,
        invalid_urls: 0,
        failed_checks: [],
    },
    loading: false,
    error: null,
}


export const institutionAutoSlice = createSlice({
    name: "checkAuto",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(CheckAutomaticRun.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(CheckAutomaticRun.fulfilled, (state, action) => {
            state.data = action.payload; 
            state.loading = false;
            state.error = null;
        });
        builder.addCase(CheckAutomaticRun.rejected, (state) => {
            state.loading = false;
            state.error = "Ошибка при выполнении автоматической проверки.";
        });
    },
});

export const institutionAutoCheckReducer = institutionAutoSlice.reducer;
