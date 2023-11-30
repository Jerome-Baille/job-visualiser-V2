import http from './httpService';
import { API_ENDPOINTS } from "../config/apiConfig";
import { JobData } from "../interfaces";

export const postOpportunity = async (opportunity: JobData) => {
    const response = await http.post(`${API_ENDPOINTS.job}`, opportunity);
    return response.data;
}

export const getOpportunities = async () => {
    const response = await http.get(`${API_ENDPOINTS.job}`);
    return response.data;
}

export const getOpportunity = async (id: string) => {
    const response = await http.get(`${API_ENDPOINTS.job}/${id}`);
    return response.data;
}

export const putOpportunity = async (opportunity: JobData) => {
    const response = await http.patch(`${API_ENDPOINTS.job}/${opportunity.id}`, opportunity);
    return response;
}

export const deleteOpportunity = async (id: string) => {
    const response = await http.delete(`${API_ENDPOINTS.job}/${id}`);
    return response;
}

export const exportOpportunities = async (selectedYear: string, selectedFormat: string) => {
    const url = `${API_ENDPOINTS.export}/${selectedYear}/${selectedFormat}`;

    try {
        const response = await http({
            method: "GET",
            url,
            responseType: "blob",
        });

        const file = new Blob([response.data], { type: response.headers["content-type"] });

        let filename;
        if (selectedFormat === "excel") {
            filename = `Jerome_BAILLE_-_Tableau_de_bord_des_candidature_-_${Date.now()}.xlsx`;
        } else {
            filename = `Jerome_BAILLE_-_Tableau_de_bord_des_candidature_-_${Date.now()}.pdf`;
        }

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(file);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 0);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error(`Failed to export opportunities: ${error.message}`);
        } else {
            throw error;
        }
    }
}