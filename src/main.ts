import './app/tailwind/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Application, router } from './app'

const app = createApp(Application)

app.use(createPinia())
app.use(router)

app.mount('#app')
