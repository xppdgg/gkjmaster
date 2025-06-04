import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import "xgplayer/dist/index.min.css";
import 'ant-design-vue/dist/reset.css';
// import VueDraggableResizable from 'vue-draggable-resizable'
let app = createApp(App);
const store = createPinia();
// app.use(Loading);   //把组件直接加载了
app.use(router);
app.use(store);
app.use(Antd);
// app.use(VueDraggableResizable)

app.mount('#app')
