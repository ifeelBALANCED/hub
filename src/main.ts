import './app/tailwind/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Application, router } from './app'
import { VueQueryPlugin, queryClient } from '@/shared/api/tanstack'

const app = createApp(Application)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, {
  queryClient,
})

app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
