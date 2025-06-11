import { createApp } from 'vue';
import App from './App.vue';
import store from './store/index';
import router from './router/index';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App).use(store).use(router).mount('#app');
