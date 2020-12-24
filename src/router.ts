import Vue from 'vue';
import MainMenu from '@/layouts/MainMenu.vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MainMenu,
      name: 'MainMenu'
    }
  ]
});
