import {defineStore} from 'pinia';
import {api} from "@/src/services/api.ts";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";
import {encryptPayload} from "@/src/services/crypto.ts";
import {ISchoolItem} from "@/src/interface/ISchool.ts";
import {IRegisterUserResponse} from "@/src/stores/models/auth/response/IRegisterUserResponse.ts";
import {IRegisterUserRequest} from "@/src/stores/models/auth/request/IRegisterUserRequest.ts";
import {toast} from 'vue-sonner'

export interface AppStateProps {
    email: string;
    fullName: string;
    phoneNumber: string;
    schoolName: string;
    schoolGrade: string;
    isLoading: boolean;
    schools: ISchoolItem[]
    isAuthenticated: boolean;

}

export const useAppStore = defineStore('appStore', {
    state: (): AppStateProps => ({
        email: null,
        fullName: null,
        phoneNumber: null,
        schoolName: null,
        schoolGrade: null,
        schools: [],
        isLoading: false,
        isAuthenticated: false
    }),
    getters: {
        allSchools: (state) => state.schools
    },
    actions: {
        async register(request: IRegisterUserRequest): Promise<void> {
            this.isLoading = true;
            try {
                const response: ApiResponse<IRegisterUserResponse> = await api.register(request);
                if (!response.isError) {
                    const responseData = response?.object
                    this.email = responseData?.email;
                    this.fullName = responseData?.fullName;
                    this.phoneNumber = responseData?.phoneNumber;
                    this.schoolName = responseData?.schoolName;
                    this.schoolGrade = responseData?.schoolGrade;
                    // this.isAuthenticated = true;
                    localStorage.setItem('access_token', encryptPayload(responseData?.accessToken))
                    toast.success("Đăng ký thành công")
                }
            } catch (error) {
                console.log(error.response.data)
                toast.error(error.response.data.error.message);

            } finally {
                this.isLoading = false;
            }
        },

        // async login(request: IGoogleLoginPayload) {
        //     this.isLoading = true;
        //     try {
        //         const response: ApiResponse<GoogleLoginResponse> = await api.googleLogin(request);
        //         if (!response.isError) {
        //             const responseData: GoogleLoginResponse = response?.object
        //             this.email = responseData?.email;
        //             this.username = responseData?.username;
        //             this.given_name = responseData?.given_name;
        //             this.family_name = responseData?.family_name;
        //             this.image = responseData?.image;
        //             this.isAuthenticated = true;
        //             localStorage.setItem('access_token',encryptPayload( responseData?.access_token));
        //         }
        //     } catch (error) {
        //         localStorage.removeItem('access_token');
        //         console.log(error);
        //     } finally {
        //     this.isLoading = false;
        //     }
        // },


        async logout() {
            this.isLoading = true;
            this.isAuthenticated = false;
            localStorage.removeItem('access_token');
            this.isLoading = false;
        },

        async getSchools() {
            this.isLoading = true;
            try {
                const response: ApiResponse<ISchoolItem[]> = await api.getSchools();
                if (!response.isError) {
                    this.schools = response?.object
                }
            } catch (error) {
                localStorage.removeItem('access_token');
                // console.log(error.data.error.message);
            } finally {
                this.isLoading = false
            }
        }

    }
})


// export const useAuthStore = defineStore('auth', () => {
//   const isAuthen = ref(false);
//   const user = ref<IUser | null>(null);
//
//   // Initialize and restore saved sessions when Pinia store is defined
//   function initAuth() {
//     const token = localStorage.getItem('langspace_token');
//     const storedUser = localStorage.getItem('langspace_user');
//     if (token && storedUser) {
//       try {
//         user.value = JSON.parse(storedUser);
//         isAuthen.value = true;
//       } catch (e) {
//         logout();
//       }
//     }
//   }
//
//   async function login(request :IGoogleLoginPayload) {
//     const response = await api.googleLogin(request);
//   }
//
//   function logout() {
//     isAuthen.value = false;
//     user.value = null;
//     localStorage.removeItem('langspace_token');
//     localStorage.removeItem('langspace_user');
//   }
//
//   // Restore session
//   initAuth();
//
//   return { isAuthen, user, login, logout };
// });

