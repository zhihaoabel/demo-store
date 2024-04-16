import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import api from '@/utils/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(api)

app.mount('#app')
