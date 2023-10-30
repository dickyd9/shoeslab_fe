import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "./assets/css/app.css"
import moshaToast from "mosha-vue-toastify"
import "mosha-vue-toastify/dist/style.css"
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"

import filters from "./helper/filters"
import { useResetForm } from "./stores/reset.form"
import piniaPersist from 'pinia-plugin-persist'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

app.component("QuillEditor", QuillEditor)
app.use(router)
app.use(pinia)
app.use(moshaToast)
app.config.globalProperties.$filters = filters
app.config.globalProperties.$useResetForm = useResetForm //usage: const { formData, resetForm } = $useResetForm(initialFormData)

app.mount("#app")
