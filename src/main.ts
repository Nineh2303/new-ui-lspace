import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './index.css';
import vue3GoogleLogin from 'vue3-google-login'
import {router} from "@/src/routes";
const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(
    vue3GoogleLogin, {
        clientId: "956514906020-ahg96bdqm6c224c6g8jkh9ftt4936gep.apps.googleusercontent.com",
    }
)
app.use(router).mount('#root');
