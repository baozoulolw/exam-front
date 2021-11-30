import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons'
// 导入转换图标名称的函数
import { transElIconName } from './utils/utils.js'

const app = createApp(App)
  .use(ElementPlus)
  .use(router)
  .use(store)
  .use(store)
// 统一注册el-icon图标
for (let iconName in ElIconModules) {
  app.component(transElIconName(iconName), ElIconModules[iconName])
}
app.mount('#app')
