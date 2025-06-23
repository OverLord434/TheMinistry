import { createAsyncThunk } from "@reduxjs/toolkit";
import { TypeCheckApi } from "shared/api/institution";
import { InstitutionApi } from "shared/api/institution/request-api";



export const CheckRun =  createAsyncThunk(
    'check/fetchByInfoInstitution',
    async ({url, send_to_email}: TypeCheckApi) => {
        const response = await InstitutionApi.CheckInstitutionApi({url, send_to_email});
        return response
    }
)