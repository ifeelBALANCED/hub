import './app/tailwind/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Application, router } from './app'
import { VueQueryPlugin, queryClient } from '@/shared/api/tanstack'

const app = createApp(Application)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, {
  queryClient,
})

app.mount('#app')
