import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "./assets/css/app.css"
import moshaToast from "mosha-vue-toastify"
import "mosha-vue-toastify/dist/style.css"

import filters from "./helper/filters"
import { useResetForm } from "./stores/reset.form"

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(moshaToast)
app.config.globalProperties.$filters = filters
app.config.globalProperties.$useResetForm = useResetForm //usage: const { formData, resetForm } = $useResetForm(initialFormData)

app.mount("#app")
