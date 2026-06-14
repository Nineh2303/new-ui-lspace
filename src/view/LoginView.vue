<template>
  <div class="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <LoginForm
            @login="loginAction"
            :loginForm="loginForm"
        />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import { useAppStore } from '@/src/stores/app.ts'

const router = useRouter()
const appStore = useAppStore()

const loginForm = reactive({
  userName: '',
  password: ''
})

const loginAction = async () => {
  if (!loginForm.userName || !loginForm.password) {
    appStore.modalMessage = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu";
    appStore.isModal = true;
    return;
  }
  await appStore.login({
    userName: loginForm.userName,
    password: loginForm.password
  })
  
  if (appStore.isAuthenticated) {
    router.push('/')
  }
}

onMounted(() => {
  if (appStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped></style>