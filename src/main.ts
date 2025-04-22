import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
const queryClient = new QueryClient()
const app = createApp(App)
app.use(createPinia())
app.use(VueQueryPlugin, {
    queryClient
})
app.mount('#app')

