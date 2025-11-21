import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// import router from './router';


// 创建App并挂载
const app = createApp(App);
app.use(ElementPlus);
// app.use(router); 
app.mount('#app');


