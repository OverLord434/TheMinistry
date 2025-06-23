import { createAsyncThunk } from "@reduxjs/toolkit";
import { InstitutionApi } from "shared/api/institution/request-api";


export const CheckAutomaticRun = createAsyncThunk(
    'automatic/checkAutomaticInstitution',
    async ({email_subject, email_body}: { email_subject: string, email_body: string}) => {
        const response = await InstitutionApi.CheckAutomaticApi(email_subject, email_body)
        return response
    }
)