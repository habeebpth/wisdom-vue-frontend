import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './assets/tailwind.css'

// Create and mount the application
const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')