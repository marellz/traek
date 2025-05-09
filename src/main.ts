import '@/assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import components from './components'
import { MotionPlugin } from '@vueuse/motion'
import App from '@/app.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(MotionPlugin)
Object.keys(components).forEach((name) => app.component(name, components[name as string]))
router.isReady().then(() => {
  app.mount('#app')
})
