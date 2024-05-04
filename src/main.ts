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

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh5_Y3DJ4xlHOjXPBlB64BYR7pzc77flM",
  authDomain: "traking-f524d.firebaseapp.com",
  databaseURL: "https://traking-f524d-default-rtdb.firebaseio.com",
  projectId: "traking-f524d",
  storageBucket: "traking-f524d.appspot.com",
  messagingSenderId: "1050282301908",
  appId: "1:1050282301908:web:06fb9d9920dc87322b5e41",
  measurementId: "G-H93MDGLLGC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const storage = getStorage(firebaseApp); // Utilisez firebaseApp au lieu de app
