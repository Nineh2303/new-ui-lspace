<template>
  <div class="w-full h-screen flex justify-center pt-20">
    <div class="w-[80%] bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-between">
      <div class="w-full grid grid-cols-1 lg:grid-cols-2">
        <!-- Banner -->
        <div class="hidden lg:flex items-center justify-center bg-gray-50 p-8">
          <img
              src="../assets/IMG_0931.png"
              alt="Register Banner"
              class="max-h-175 w-auto object-contain"
          />
        </div>

        <!-- Form -->
        <div class="p-6 sm:p-8 lg:p-12">
          <div class="w-full flex flex-col items-center mb-8 space-y-2">
            <h1 class="text-xl sm:text-2xl font-bold text-center text-gray-900">
              Hành trình chinh phục chứng chỉ
            </h1>

            <p class="text-2xl sm:text-3xl text-blue-500 font-bold">BẮT ĐẦU!</p>
          </div>
          <form
              @submit.prevent="onRegister"
              class="w-full flex flex-col justify-between space-y-4"
          >
            <FormField v-slot="{ componentField }" name="fullName">
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên " v-bind="componentField"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="phoneNumber">
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="schoolName">
              <FormItem>
                <FormLabel>Bạn đang là sinh viên trường nào</FormLabel>
                <FormControl>
                  <Select class="w-full flex flex-col items-center w-full"
                          :model-value="componentField.modelValue"
                          @update:model-value="componentField['onUpdate:modelValue']"
                  >
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Chọn trường của bạn" class="text-black"/>
                      </SelectTrigger>
                      <SelectContent class="w-full h-[300px]">
                        <input type="text" class="w-full bt-2 h-[40px] border-2 px-[15px]" v-model="schoolFilter">
                        <SelectItem
                            v-for="school in schoolFilterComputed"
                            :key="school.schoolCode"
                            :value="school.schoolCode"
                            class="w-full h-[50px]"
                        >
                          {{ school.schoolName }}
                        </SelectItem>
                      </SelectContent>
                    </FormControl>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <FormField
                v-slot="{ componentField }"
                name="schoolGrade"
            >
              <FormItem>
                <FormLabel>Bạn đang là sinh viên năm mấy</FormLabel>
                <Select class="w-full flex flex-col items-center w-full"
                        :model-value="componentField.modelValue"
                        @update:model-value="componentField['onUpdate:modelValue']"
                >
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn năm học" class="text-black"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                          v-for="grade in grades"
                          :key="grade.value"
                          :value="grade.value"
                      >
                        {{ grade.label }}
                      </SelectItem>
                    </SelectContent>
                  </FormControl>
                </Select>
                <FormMessage/>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập username" type="password" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="repeatPassword">
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập username" type="password" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <Button
                type="submit"
                class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold">Đăng ký
            </Button>
          </form>
          <p class="text-center text-sm sm:text-base text-gray-600 mt-6">
            Nếu bạn đã có tài khoản

            <router-link
                to="/login"
                class="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Đăng nhập ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {useAppStore} from "@/src/stores/auth.ts";
import {IRegisterUser} from "@/src/interface/IRegisterUser.ts";
import {Button} from "@/src/components/ui/button";
import {useForm} from 'vee-validate';

import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/src/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {Input} from "@/src/components/ui/input";
import {registerSchema} from "@/src/form-valiate/validate.ts";
import {ISchoolItem} from "@/src/interface/ISchool.ts";

const appStore = useAppStore();

const schoolFilter = ref('')
const schools = ref<ISchoolItem[]>()


const initialRegisterForm = reactive<IRegisterUser>({
  fullName: 'chinh nguyen duc',
  email: 'chinhnguyenduc2000@gmail.com',
  phoneNumber: "0326550233",
  schoolName: 'PTIT',
  schoolGrade: '',
  password: '000000',
  repeatPassword: '000000'
})


const registerForm = useForm<IRegisterUser>({
  validationSchema: registerSchema,
  initialValues: initialRegisterForm,
})
onMounted(async() => {
  await appStore.getSchools();
  schools.value = appStore.allSchools
  console.log("in compo",schools.value)
})

const onRegister = registerForm.handleSubmit(
    async (values) => {
      console.log(values)

      // await appStore.register(values)
    }
)
const schoolFilterComputed:[ISchoolItem] = computed(() => {
  if (!schoolFilter.value) {
    return schools.value
  }
  return schools.value.filter(e => e.label.toLowerCase().includes(schoolFilter.value.toLowerCase()))
})
const grades = [
  {value: '1', label: 'Năm 1'},
  {value: '2', label: 'Năm 2'},
  {value: '3', label: 'Năm 3'},
  {value: '4', label: 'Năm 4'},
]

</script>

<style scoped></style>