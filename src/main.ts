import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 导入路由
import i18n from "./local"; // 导入国际化
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// 快速复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
// 显示代码行数
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';

import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
// Prism
import Prism from 'prismjs';
// 代码高亮
import 'prismjs/components/prism-json';
// 选择使用主题
VMdPreview.use(vuepressTheme, {
    Prism,
});
// markdown支持显示代码行数
VMdPreview.use(createLineNumbertPlugin())
// markdown支持代码快速复制
VMdPreview.use(createCopyCodePlugin());
// markdown支持emoji
VMdPreview.use(createEmojiPlugin());
const pinia = createPinia()

// 权限指令
const userPermissions: Array<string> = []

const app = createApp(App)
app.config.globalProperties.$per = userPermissions;
app.directive('hasPermission', {
    mounted(el, binding) {
        if (!userPermissions.includes(binding.value)) {
            el.parentNode.removeChild(el);
        }
    }
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 引入v-md-editor预览组件
app.use(VMdPreview);
app.use(pinia)
app.use(i18n)
app.use(ElementPlus)
app.use(router) // 使用路由
app.mount('#app')
