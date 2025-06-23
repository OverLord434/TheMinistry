import axios from "axios"
import { TypeCheckApi } from "../types"

const baseUrl = "http://82.202.128.59"



export namespace InstitutionApi {
    export const CheckInstitutionApi = async ({url, send_to_email}: TypeCheckApi) => {
        try {
            const response = await axios.post(`${baseUrl}/api/parse/`, {url, send_to_email})    
            return response.data
        } catch (error) {
            console.log("Ошибка проверки учреждения: ", error);
            throw error;
        }
        }
        export const CheckAutomaticApi = async (email_subject: string, email_body: string) => {
            try {
                const response = await axios.post(`${baseUrl}/api/auto-check/`, {email_subject, email_body})
                return response.data
            } catch (error) {
                console.log("Ошибка автоматической проверки: ", error);
                throw error;
            }
        }
}

