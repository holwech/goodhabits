<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    color="#ff9a0d"
  >
    <b-navbar-brand href="#">
      <span
        style="color:white"
      >
        Habit Bird
      </span>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />
    <slot name="main" />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav class="ml-auto">
        <slot />
      </b-navbar-nav>
    </b-collapse>
    <b-icon
      v-if="showCollapseButton"
      @click="collapseToolbar = !collapseToolbar"
    >
      {{
        collapseToolbar ? 'keyboard_arrow_right' : 'keyboard_arrow_left'
      }}
    </b-icon>
  </b-navbar>
</template>

<script lang="ts">
import Auth from '@/utils/Auth';
import { defineComponent, inject, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'Toolbar',
  props: {
    showCollapseButton: {
      type: Boolean
    }
  },
  setup(props) {
    const collapseToolbar = ref(false);
    const auth = inject('auth') as Auth;
    const betaText = () => {
      auth
        .getAccessTokenAsync({
          scopes: [
            process.env.VUE_APP_SCOPE_WRITE,
            process.env.VUE_APP_SCOPE_READ
          ]
        })
        .then(token => console.log(token.accessToken));
      console.log(auth.account);
    };
    return {
      collapseToolbar,
      betaText
    };
  }
});
</script>