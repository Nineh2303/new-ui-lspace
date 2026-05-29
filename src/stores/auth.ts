import {defineStore} from 'pinia';
import {api} from "@/src/services/api.ts";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";
import {IGoogleLoginPayload} from "@/src/interface/IGoogleLoginPayload.ts";
import {IGetUserLogin, IGoogleLoginResponse} from "@/src/interface/IGoogleLoginResponse.ts";
import {encryptPayload} from "@/src/services/crypto.ts";

export interface AppStateProps {
    username: string;
    given_name: string;
    family_name: string;
    email: string;
    image: string;
    isLoading: boolean;
    isAuthenticated: boolean;

}

export const useAppStore = defineStore('appStore', {
    state: (): AppStateProps => ({
        username: null,
        given_name: null,
        family_name: null,
        email: null,
        image: null,
        isLoading: false,
        isAuthenticated: false
    }),

    actions: {
        async login(request: IGoogleLoginPayload) {
            this.isLoading = true;
            try {
                const response: ApiResponse<IGoogleLoginResponse> = await api.googleLogin(request);
                if (!response.isError) {
                    const responseData: IGoogleLoginResponse = response?.object
                    this.email = responseData?.email;
                    this.username = responseData?.username;
                    this.given_name = responseData?.given_name;
                    this.family_name = responseData?.family_name;
                    this.image = responseData?.image;
                    this.isAuthenticated = true;
                    localStorage.setItem('access_token',encryptPayload( responseData?.access_token));
                }
            } catch (error) {
                localStorage.removeItem('access_token');
                console.log(error);
            } finally {
            this.isLoading = false;
            }
        },


        async logout() {
            this.isLoading = true;
            this.isAuthenticated = false;
            localStorage.removeItem('access_token');
            this.isLoading = false;
        },

        async getUser() {
            this.isLoading = true;
            try {
                const response = await api.getCurrentUser();
                if (!response.isError) {
                    const responseData: IGetUserLogin = response?.object
                    this.email = responseData?.email;
                    this.username = responseData?.username;
                    this.given_name = responseData?.given_name;
                    this.family_name = responseData?.family_name;
                    this.image = responseData?.image;
                    this.isAuthenticated = true;
                }
            } catch (error) {
                localStorage.removeItem('access_token');
                console.log(error);
            } finally {
            this.isLoading=false
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

