// user-module.ts
import { VuexModule, Module, Mutation, Action } from 'vuex-class-modules';
import Auth from '@/utils/Auth';

@Module({ generateMutationSetters: true })
class UserStore extends VuexModule {
  // state
  public loggedIn = false;
  public username = 'Unknown';
  
  @Action
  public async login(auth: Auth) {
    try {
      await auth.login();
      this.loggedIn = true;    
      this.username = auth.account!.idTokenClaims.given_name;
    } catch(e) {
      if (process.env.NODE_ENV == 'development') {
        console.error(e);
        this.loggedIn = false;
      }
    }
  }

  @Action
  public async logout(auth: Auth) {
    await auth.logout();
  }

  @Action
  public async signup(auth: Auth) {
    await auth.signup();
  }
}

// register module (could be in any file)
import store from './store';
export const userStore = new UserStore({ store, name: 'user' });