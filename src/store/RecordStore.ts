import { VuexModule, Action, Module, Mutation } from 'vuex-class-modules';
import Auth from '@/utils/Auth';
import { SaveDialogForm } from '@/models/SaveDialogForm';

@Module({ generateMutationSetters: true })
class RecordStoreModule extends VuexModule {
  public loading: boolean = false;
  public loadingMetadata = false;
  public loadingRecording = false;
  public recording: any[] = [];
  public recordingMetadata: RecordingMetadata = {
    createdBy: '',
    description: '',
    givenName: '',
    id: '',
    surname: '',
    title: ''
  };
  public error: string = '';

  @Mutation
  public SetRecording(recording: any[]) {
    this.recording = recording;
  }

  @Action
  public async Save(args: { auth: Auth, formData: SaveDialogForm }) {
    this.loading = true;
    console.log('Saving recording...');
    let log = JSON.stringify(this.recording);
    let storageSpace = (encodeURI(log).split(/%..|./).length - 1) / 1000000;
    console.log(`Storing ${String(storageSpace)} MB`);
    if (storageSpace > 2000000) {
      let error = 'Recording too large (yes you got a problem now)';
      this.error = error;
      console.warn(error);
      return;
    }
    args.auth
      .query(
        process.env.VUE_APP_URL + '/api/create',
        {
          scopes: [
            process.env.VUE_APP_SCOPE_WRITE,
            process.env.VUE_APP_SCOPE_READ
          ]
        },
        'POST',
        {
          Recording: log,
          Title: args.formData.title,
          Description: args.formData.description
        }
      )
      .then(res => {
        console.log(res);
        this.loading = false;
      });
  }

  @Action
  public async LoadMetadata(args: { id: string, auth: Auth }) {
    console.log('Loading metadata');
    this.loadingMetadata = true;
    let res = await args.auth
      .query(
        process.env.VUE_APP_URL + `/api/metadata/${args.id}`,
        {
          scopes: [
            process.env.VUE_APP_SCOPE_WRITE,
            process.env.VUE_APP_SCOPE_READ
          ]
        },
        'GET',
        null,
        false
      );
    let json = await res.json();
    this.recordingMetadata = json[0];
    this.loadingMetadata = false;
  }

  @Action
  public async LoadRecording(args: { id: string, auth: Auth }) {
    console.log('Loading recordings');
    this.loadingRecording = true;
    let res = await args.auth
      .query(
        process.env.VUE_APP_URL + `/api/recording/${args.id}`,
        {
          scopes: [
            process.env.VUE_APP_SCOPE_WRITE,
            process.env.VUE_APP_SCOPE_READ
          ]
        },
        'GET',
        null,
        false
      );
    let json = await res.json();
    this.recording = JSON.parse(json[0].recording);
    this.loadingRecording = false;
  }
}

import store from './store';
import RecordingMetadata from '@/models/Resource';
export const RecordStore = new RecordStoreModule({ store, name: 'RecordStore' });