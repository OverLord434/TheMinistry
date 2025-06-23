import { createSlice } from "@reduxjs/toolkit";
import { DataInstitutionType } from "shared/api/institution"
import { CheckRun } from "./actions/run-check";

type InstitutionState = {
    data: DataInstitutionType;
    loading: boolean;
    error: string | null;
}

type FailedChecks = {
    organization: string;
    reason: string;
    type: string;
    url: string;
}

const initialState: InstitutionState = {
    data: {
        status: "",
        organization: "",
        sections: []
    },
    loading: false,
    error: null,
}

export const institutionSlice = createSlice({
    name: "check",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(CheckRun.pending, (state) => {
            state.loading = true
        })
        builder.addCase(CheckRun.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(CheckRun.rejected, (state) => {
            state.loading = false;
            state.data = initialState.data;
            state.error = "Такой организации нет.";
        })
       
    },
})

export const institutionReducer = institutionSlice.reducer;