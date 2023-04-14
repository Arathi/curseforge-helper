import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import App from './App.vue';

// @ts-ignore
let $ = window.jQuery;

// create Vue App
const app = createApp(App);

// Element Plus
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

let main = $("main")[0];

let containerOrigin = main.children[0];
containerOrigin.id = "main-container-origin";
// containerOrigin.style = "display: none;";

let container = document.createElement('div');
container.id = "main-container";
container.classList.add("container");
container.classList.add("mx-auto");
container.classList.add("mt-6");
container.classList.add("flex");
container.classList.add("flex-col");
container.classList.add("flex-1");
// main.appendChild(container);
main.insertBefore(container, containerOrigin);

// mount
app.mount(
  container
);