import { createApp } from "vue";
import {createPinia } from 'pinia'
import i18n from './i18n'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import comps from "./components";
import router from "./route";
import "./styles/app.scss";
import "@/icons";
import * as Icons from "@element-plus/icons-vue";
import jsx from "./demo/test.jsx";
const app = createApp(App);
app.use(ElementPlus);
app.use(comps);
app.use(i18n);
app.use(router);
app.use(createPinia());
app.use(jsx);
//加载自定义指令
app.mount("#app");
window.getApp = () => app;
// 注册全局组件
Object.keys(Icons).forEach((key) => {
  app.component("ElIcon" + key, Icons[key]);
});
