import {createWebHistory, createRouter} from 'vue-router'
import HomeVue from '@/src/view/HomeView.vue'
import LoginView from "@/src/view/LoginView.vue";
import RegisterView from "@/src/view/RegisterView.vue";
import { useAppStore } from "@/src/stores/app.ts";

const routes = [
    // ── Public routes ────────────────────────────────────────────────
    {path: '/', component: HomeVue},
    {path: '/login', component: LoginView, meta: { guestOnly: true }},
    {path: '/register', component: RegisterView, meta: { guestOnly: true }},

    // ── Requires authentication ──────────────────────────────────────
    { path: '/videos', component: () => import('@/src/view/VideosView.vue'), meta: { requiresAuth: true } },
    { path: '/articles', component: () => import('@/src/view/ArticlesView.vue'), meta: { requiresAuth: true } },

    // ── Examinations (requires auth) ─────────────────────────────────
    { path: '/exams', component: () => import('@/src/view/ExamListView.vue'), meta: { requiresAuth: true } },
    { path: '/exams/:id', component: () => import('@/src/view/ExamDetailView.vue'), meta: { requiresAuth: true } },
    { path: '/exams/:id/take', component: () => import('@/src/view/ExamTakeView.vue'), meta: { requiresAuth: true } },
    { path: '/exams/:id/result/:attemptId', component: () => import('@/src/view/ExamResultView.vue'), meta: { requiresAuth: true } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
    const appStore = useAppStore();

    // Nếu có token nhưng chưa restore session (F5 / nhập URL trực tiếp)
    const hasToken = !!localStorage.getItem('langspace_token');
    if (hasToken && !appStore.isAuthenticated) {
        await appStore.getCurrentUser();
    }

    if (to.meta.requiresAuth && !appStore.isAuthenticated) {
        next('/login');
    } else if (to.meta.guestOnly && appStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
})