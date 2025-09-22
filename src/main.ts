import './app/tailwind/main.css'
import naive from 'naive-ui'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Application } from './app'
import router from './router'

const app = createApp(Application)

app.use(createPinia())
app.use(naive)
app.use(router)

app.mount('#app')
