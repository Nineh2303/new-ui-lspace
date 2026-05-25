import {defineStore} from 'pinia';
import {api} from "@/src/services/api.ts";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";
import {IGoogleLoginPayload} from "@/src/interface/IGoogleLoginPayload.ts";
import {IGoogleLoginResponse} from "@/src/interface/IGoogleLoginResponse.ts";

export interface AppStateProps {
    username?: string;
    email?: string;
    image?: string;
    isLoading: boolean;
    isAuthenticated: boolean;

}
export const useAppStore = defineStore('appStore',{
  state: (): AppStateProps =>({
    username:null,
    email:null,
    image: null,
    isLoading: false,
    isAuthenticated: false
  }),

  actions: {
    async login (request :IGoogleLoginPayload){
      this.isLoading = true;
      const response: ApiResponse<IGoogleLoginResponse> = await api.googleLogin(request);
      if(!response.isError) {
        const responseData: IGoogleLoginResponse = response?.object
        this.email = responseData?.email;
        this.username = responseData?.username;
        this.image = responseData?.image;
        this.isAuthenticated = true;
      }
      this.isLoading = false;
    },
    async logout (){
      this.isLoading = true;
      localStorage.removeItem('google_authentication');
      this.isAuthenticated = false;
      this.isLoading = false;
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

