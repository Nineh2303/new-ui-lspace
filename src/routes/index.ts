import {createWebHistory, createRouter} from 'vue-router'
import HomeVue from '@/src/view/HomeView.vue'
import LoginView from "@/src/view/LoginView.vue";
import RegisterView from "@/src/view/RegisterView.vue";

const routes = [
    {path: '/', component: HomeVue},
    {path: '/login', component: LoginView},
    {path: '/register', component: RegisterView},
    // {path: '/login', component: LoginView},
    // ...['/login','/register'].map(path=>({
    //     path,
    //     component:  LoginView
    // }))
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})