import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './index.css';
import {router} from "@/src/routes";
import {useThemeStore} from "@/src/stores/themeStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router)

// Khởi tạo theme trước khi mount (restore từ localStorage)
useThemeStore().init()

app.mount('#root');
