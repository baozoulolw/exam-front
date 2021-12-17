import { createApp } from '/node_modules/.vite/vue.js?v=6be115ad'
import App from '/src/App.vue'
import ElementPlus from '/node_modules/.vite/element-plus.js?v=6be115ad'
import '/node_modules/element-plus/dist/index.css'
import router from '/src/router/index.js?t=1639710298207'
import store from '/src/store/index.js'
// 统一导入el-icon图标
import * as ElIconModules from '/node_modules/.vite/@element-plus_icons.js?v=6be115ad'
// 导入转换图标名称的函数
import { transElIconName } from '/src/utils/utils.js'

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
