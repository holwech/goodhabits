import Vue from 'vue';
import router from './router';
import App from './App.vue';
import store from './store/store';
import Router from 'vue-router';
import './registerServiceWorker';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import '@/assets/style/main.scss';
import VueCompositionAPI from '@vue/composition-api';
import Auth, { IUserFlows } from './utils/Auth';
import { Configuration } from 'msal';

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
    $router: Router;
  }
}

const config: Configuration = {
  auth: {
    clientId: 'f8b8ed45-8ac1-442d-961d-c6efb6f2413b',
    authority:
      'https://incrementally.b2clogin.com/incrementally.onmicrosoft.com/B2C_1_signin_or_signup',
    validateAuthority: false
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};
const userFlows: IUserFlows = {
  signin:
    'https://incrementally.b2clogin.com/incrementally.onmicrosoft.com/B2C_1_signin_or_signup',
  signup:
    'https://incrementally.b2clogin.com/incrementally.onmicrosoft.com/B2C_1_signup'
};
const auth = new Auth(config, userFlows);
Vue.prototype.$auth = auth;
// Currently Vue 2 + composition API + router does not like each other.
// This line is added so that App.vue can access the router and inject it for
// composition API type components.
Vue.prototype.$routerHandle = router;


Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;


Vue.use(Router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
