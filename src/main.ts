import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)






/* sweetalert */
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'


/* axios */
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://localhost:8080/'



/* Toast */
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'



// Mount vue app
app.mount('#app')
