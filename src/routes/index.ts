import {createWebHistory, createRouter} from 'vue-router'
import HomeVue from '@/src/view/HomeView.vue'
import LoginView from "@/src/view/LoginView.vue";
import RegisterView from "@/src/view/RegisterView.vue";

const routes = [
    {path: '/', component: HomeVue},
    {path: '/login', component: LoginView},
    {path: '/register', component: RegisterView},

    // ── Examinations feature ─────────────────────────────────────
    { path: '/exams', component: () => import('@/src/view/ExamListView.vue') },
    { path: '/exams/:id', component: () => import('@/src/view/ExamDetailView.vue') },
    { path: '/exams/:id/take', component: () => import('@/src/view/ExamTakeView.vue') },
    { path: '/exams/:id/result/:attemptId', component: () => import('@/src/view/ExamResultView.vue') },
    { path: '/admin', component: () => import('@/src/view/admin/AdminView.vue') },
    { path: '/admin/exams/new', component: () => import('@/src/view/admin/CreateExamView.vue') },
    { path: '/admin/exams/:id/edit', component: () => import('@/src/view/admin/EditExamView.vue') },
    { path: '/admin/exams/:id/questions', component: () => import('@/src/view/admin/ManageQuestionsView.vue') },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})