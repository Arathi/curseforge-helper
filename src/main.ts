import { createPinia } from 'pinia';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import App from './App.vue';

// @ts-ignore
let $ = window.jQuery;

// 创建Vue应用
const app = createApp(App);

// Pinia
const pinia = createPinia();
app.use(pinia);

// Element Plus
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

let main = $("main")[0];

// 获取原先的容器
let containerOrigin = main.children[0];
containerOrigin.id = "main-container-origin";
// containerOrigin.style = "display: none;";

// 创建应用容器
let container = document.createElement('div');
container.id = "main-container";
container.classList.add("container");
container.classList.add("mx-auto");
container.classList.add("mt-6");
container.classList.add("flex");
container.classList.add("flex-col");
container.classList.add("flex-1");
main.insertBefore(container, containerOrigin);

// 挂载到容器
app.mount(
  container
);
