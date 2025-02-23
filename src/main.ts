import '@/assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import components from './components'
import App from '@/app.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
Object.keys(components).forEach((name) => app.component(name, components[name as string]))
app.mount('#app')
