import axios from "axios"
import {decryptPayload, encryptPayload} from "@/src/services/crypto.ts";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

httpClient.interceptors.request.use((config) => {
    console.log(`Request to api ${config.url}:`, config.data);
    const token = decryptPayload(localStorage.getItem("access_token"));
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data && !(config.data instanceof FormData)) {
        const encryptedData = encryptPayload(config.data);
        if (encryptedData) {
            config.data = {data: encryptedData};
        }
    }
    return config;
})

httpClient.interceptors.response.use(
    (response) => {
        if (response.data) {
            const decrypted = decryptPayload(response.data.data);
            if (decrypted) {
                response.data =  decrypted;
            }
        }
        console.log(`Response from mid ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);