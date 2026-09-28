import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import 'virtual:windi.css'
import {router} from '@/router/index.js'
import "nprogress/nprogress.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import permission from '@/directives/permission.js'

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(permission)
app.use(pinia)
app.use(router)
app.mount('#app')
