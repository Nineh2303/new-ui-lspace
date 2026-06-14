import {defineStore} from 'pinia';
import {userApi} from "@/src/apis";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";
import {encryptPayload} from "@/src/services/crypto.ts";
import {ISchoolItem} from "@/src/interface/ISchool.ts";
import {IRegisterUserResponse} from "@/src/stores/models/auth/response/IRegisterUserResponse.ts";
import {IRegisterUserRequest} from "@/src/stores/models/auth/request/IRegisterUserRequest.ts";
import {ILoginUserRequest} from "@/src/stores/models/auth/request/ILoginUserRequest.ts";
import {toast} from 'vue-sonner'

export interface AppStateProps {
    email: string;
    fullName: string;
    phoneNumber: string;
    schoolName: string;
    schoolGrade: string;
    role: string;
    isLoading: boolean;
    schools: ISchoolItem[]
    isModal: boolean;
    modalMessage: string
    isAuthenticated: boolean;
}

export const useAppStore = defineStore('appStore', {
    state: (): AppStateProps => ({
        email: null,
        fullName: null,
        phoneNumber: null,
        schoolName: null,
        schoolGrade: null,
        role: null,
        schools: [],
        isLoading: false,
        isModal: false,
        modalMessage: "",
        isAuthenticated: false
    }),
    getters: {
        allSchools: (state) => state.schools,
        isAdmin: (state) => state.role === 'admin',
        isStudent: (state) => state.role === 'student',
    },
    actions: {
        async register(request: IRegisterUserRequest): Promise<void> {
            this.isLoading = true;
            try {
                const response: ApiResponse<IRegisterUserResponse> = await userApi.register(request);
                if (!response.isError) {
                    const responseData = response?.object

                    // Client app chỉ dành cho học sinh
                    if (responseData?.role && responseData.role !== 'student') {
                        this.modalMessage = "Tài khoản admin không thể đăng nhập tại đây. Vui lòng dùng trang quản trị."
                        this.isModal = true;
                        return;
                    }

                    this.email = responseData?.email;
                    this.fullName = responseData?.fullName;
                    this.phoneNumber = responseData?.phoneNumber;
                    this.schoolName = responseData?.schoolName;
                    this.schoolGrade = responseData?.schoolGrade;
                    this.role = responseData?.role || 'student';
                    this.isAuthenticated = true;
                    localStorage.setItem('langspace_token', encryptPayload(responseData?.accessToken))
                    window.location.href = '/';
                }
            } catch (error) {
                console.log(error.response?.data)
                this.modalMessage = error.response?.data?.error?.message || "Lỗi đăng ký"
                this.isModal = true;
            } finally {
                this.isLoading = false;
            }
        },

        async login(request: ILoginUserRequest): Promise<void> {
            this.isLoading = true;
            try {
                const response: ApiResponse<IRegisterUserResponse> = await userApi.login({
                    ...request,
                    expected_role: 'student',
                });
                if (!response.isError) {
                    const responseData = response?.object
                    this.email = responseData?.email;
                    this.fullName = responseData?.fullName;
                    this.phoneNumber = responseData?.phoneNumber;
                    this.schoolName = responseData?.schoolName;
                    this.schoolGrade = responseData?.schoolGrade;
                    this.role = responseData?.role || 'student';
                    this.isAuthenticated = true;
                    localStorage.setItem('langspace_token', encryptPayload(responseData?.accessToken))
                    this.modalMessage = "Đăng nhập thành công!!"
                    this.isModal = true;
                }
            } catch (error) {
                console.log(error.response?.data)
                this.modalMessage = error.response?.data?.error?.message || "Sai tài khoản hoặc mật khẩu"
                this.isModal = true;
            } finally {
                this.isLoading = false;
            }
        },

        async getCurrentUser() {
            this.isLoading = true;
            try {
                const response = await userApi.getCurrentUser();
                if (!response.isError) {
                    const responseData = response?.object
                    this.email = responseData?.email;
                    this.fullName = responseData?.fullName;
                    this.phoneNumber = responseData?.phoneNumber;
                    this.schoolName = responseData?.schoolName;
                    this.schoolGrade = responseData?.schoolGrade;
                    this.role = responseData?.role || 'student';
                    this.isAuthenticated = true;
                }
            } catch (error) {
                this.logout();
            } finally {
                this.isLoading = false;
            }
        },

        closeModal() {
            this.isModal = false;
            this.modalMessage = "";
        },

        async logout() {
            this.isLoading = true;
            this.isAuthenticated = false;
            this.email = null;
            this.fullName = null;
            this.role = null;
            localStorage.removeItem('langspace_token');
            this.isLoading = false;
            window.location.href = '/';
        },

        async getSchools() {
            this.isLoading = true;
            try {
                const response: ApiResponse<ISchoolItem[]> = await userApi.getSchools();
                if (!response.isError) {
                    this.schools = response?.object
                }
            } catch (error) {
                // Ignore error
            } finally {
                this.isLoading = false
            }
        }
    }
})
