<template>
  <b-dropdown
    text="Sign up"
    right
    variant="outline-light"
    style="padding-left:5px;"
  >
    <b-dropdown-item v-if="user.loggedIn">
      {{ user.username }}
    </b-dropdown-item>
    <b-dropdown-item
      v-if="user.loggedIn"
      @click="logout"
    >
      Logout
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!user.loggedIn"
      @click="signup"
    >
      Sign up
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!user.loggedIn"
      @click="login"
    >
      Login
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AuthenticationParameters } from 'msal';
import { userStore } from '../store/UserStore';

@Component
export default class LoginButton extends Vue {
  private user = userStore;

  private async login() {
    await this.user.login(this.$auth);
  }

  private async logout() {
    await this.user.logout(this.$auth);
  }

  private async signup() {
    await this.user.signup(this.$auth);
  }
}
</script>

<style scoped></style>
