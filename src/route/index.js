//router.js
import {createRouter,createWebHistory} from "vue-router";
import Designer from "../views/design/Designer.vue";

const routes = [
  {
    path: "/index",
    name: "Home",
    component: Designer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});
export default router;