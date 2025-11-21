import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useAuthStore } from '@/stores/authStore' // import type-safe

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// init auth store BEFORE mount so App sees currentUser on first render
const auth = useAuthStore()
auth.init().finally(() => {
  router.isReady().then(() => {
    app.mount('#app')
  })
})
