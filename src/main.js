import { createApp } from "vue";
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
app.use(router);
app.use(jsx);
app.mount("#app");
window.getApp = () => app;
// 注册全局组件
Object.keys(Icons).forEach((key) => {
  app.component("ElIcon" + key, Icons[key]);
});
