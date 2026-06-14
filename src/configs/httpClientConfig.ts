import axios from "axios"
import { decryptPayload, encryptPayload } from "@/src/services/crypto.ts";
import { useAppStore } from "@/src/stores/app.ts";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: encrypt body + attach JWT token
httpClient.interceptors.request.use((config) => {
    console.log(`Request to api ${config.url}:`, config.data);

    // Attach JWT token from localStorage (single source of truth)
    const encryptedToken = localStorage.getItem("langspace_token");
    if (encryptedToken && config.headers) {
        const token = decryptPayload(encryptedToken);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    // Encrypt request body
    if (config.data && !(config.data instanceof FormData)) {
        const encryptedData = encryptPayload(config.data);
        if (encryptedData) {
            config.data = { data: encryptedData };
        }
    }
    return config;
})

// Response interceptor: decrypt body + global error modal
httpClient.interceptors.response.use(
    (response) => {
        if (response.data) {
            const decrypted = decryptPayload(response.data.data);
            if (decrypted) {
                response.data = decrypted;
            }
        }
        console.log(`Response from mid ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        // Tự động hiện modal khi server trả lỗi
        try {
            const appStore = useAppStore();
            let message = 'Đã có lỗi xảy ra. Vui lòng thử lại.';

            if (error.response) {
                const data = error.response.data;
                // Thử decrypt nếu response bị encrypt
                const decrypted = decryptPayload(data?.data);
                const errorData = decrypted || data;

                // Lấy message từ nhiều format khác nhau
                message = errorData?.error?.message
                    || errorData?.message
                    || errorData?.error
                    || `Lỗi ${error.response.status}: ${error.response.statusText}`;

                // 401 → token hết hạn
                if (error.response.status === 401) {
                    message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                }
                // 403 → không đủ quyền
                if (error.response.status === 403) {
                    message = errorData?.message || 'Bạn không có quyền thực hiện hành động này.';
                }
            } else if (error.request) {
                message = 'Không thể kết nối đến server. Kiểm tra kết nối mạng.';
            }

            appStore.modalMessage = message;
            appStore.isModal = true;
        } catch (e) {
            console.error('Modal error handler failed:', e);
        }

        return Promise.reject(error);
    }
);