<template>
  <div class="w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <LoginForm
            @login="loginAction"
            :loginForm="loginForm"
        />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RegisterForm from '../components/auth/RegisterForm.vue'
import LoginForm from '../components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()
// const shopStore = useShopStore()


const loginForm = reactive({
  email: 'chinh@gmail.com',
  password: '0000'
})
//
// const loginAction = async () => {
//   const { isValidated, form } = userValidate.loginFormValidate(loginForm)
//   const res = await shopStore.doLogin(form)
//
//   if (res.success) {
//     shopStore.loginSuccess(res)
//     shopStore.turnOnNotify(res.message, route.path)
//   } else {
//     shopStore.turnOnNotify(res.message, '/failed')
//   }
// }
//
// const registerAction = async () => {
//   const { isValidated, form } = userValidate.registerFormValidate(registerForm)
//   if (!isValidated) {
//     shopStore.turnOnNotify("Let's fill all data in the form!")
//     return
//   }
//   if (form.password !== registerForm.repeatPassword) {
//     shopStore.turnOnNotify("Your password doesn't match, please try again!")
//     return
//   }
//   const res = await shopStore.doRegister(form)
//   shopStore.turnOnNotify(res.message, route.path)
// }
//
// onMounted(() => {
//   if (shopStore.isLogin) {
//     router.push('/')
//   }
// })
</script>

<style scoped></style>