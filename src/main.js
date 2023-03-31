import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";

const app = createApp(App);
app.use(ElementPlus, { locale });

app.use(store);
app.use(router);
app.mount("#app");
