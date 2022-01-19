import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import TDesign from 'tdesign-vue-next';
import 'element-plus/dist/index.css'
import 'default-passive-events';
import router from './router'
import store from './store'
// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons'
// 导入转换图标名称的函数
import { transElIconName } from './utils/utils.js'
// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';

const app = createApp(App)
  .use(ElementPlus)
  .use(router)
  .use(store)
  .use(TDesign)
// 统一注册el-icon图标
for (let iconName in ElIconModules) {
  app.component(transElIconName(iconName), ElIconModules[iconName])
}
app.mount('#app')
