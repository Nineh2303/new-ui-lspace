<template>
  <div class="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-between">
    <div class="grid grid-cols-1 lg:grid-cols-2">
      <!-- Banner -->
      <div class="hidden lg:flex items-center justify-center bg-gray-50 p-8">
        <img
            src="../../assets/IMG_0931.png"
            alt="Register Banner"
            class="max-h-[700px] w-auto object-contain"
        />
      </div>

      <div class="p-6 sm:p-8 lg:p-12">
        <div class="flex flex-col items-center">
          <div class="w-full flex flex-col items-center mb-8 space-y-2" >
            <p class="text-xl sm:text-3xl text-blue-500 font-bold  uppercase" > Cày thôi. Sắp xong rồi !  </p>
          </div>
          <form
              @submit.prevent="login"
              class="space-y-4 w-full"
          >
            <input
                v-model="loginForm.email"
                type="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            <input
                v-model="loginForm.password"
                type="password"
                placeholder="Tạo mật khẩu"
                autocomplete="new-password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />



            <Button class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                type="submit">
              Đăng ký
            </Button>
          </form>

          <p
              class="text-center text-sm sm:text-base text-gray-600 mt-6"
          >
            Nếu bạn chưa có tài khoản

            <router-link
                to="/register"
                class="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  loginForm: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['login'])

const loginAction = () => {
  emit('login')
}
</script>

<style scoped></style>