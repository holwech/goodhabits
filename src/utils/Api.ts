import { SaveDialogFormTemplate } from '@/models/SaveDialogForm';
import { Ref, ref } from '@vue/composition-api';
import Auth from './Auth';

export function useDeleteEntry(auth: Auth, selectedDelete: Ref<string>) {
  let deleteEntryLoading = ref(false);
  const deleteEntry = async () => {
    deleteEntryLoading.value = true;
    const res = await auth.query(
      process.env.VUE_APP_URL + '/api/resource' + selectedDelete,
      {
        scopes: [
          process.env.VUE_APP_SCOPE_WRITE,
          process.env.VUE_APP_SCOPE_READ
        ]
      },
      'DELETE',
      null,
      true
    );
    deleteEntryLoading.value = false;
    return res;
  };
  return { deleteEntry, deleteEntryLoading };
}


export function useGetEntry(auth: Auth, id: string) {
  let getEntryLoading = ref(false);
  const getEntry = async () => {
    getEntryLoading.value = true;
    let response = await auth.query(
      process.env.VUE_APP_URL + '/api/resource/' + id,
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

    getEntryLoading.value = false;
    return await response.json();
  };
  return {
    getEntry,
    getEntryLoading
  };
}


export function useGetEntries(auth: Auth) {
  let getEntriesLoading = ref(false);
  const getEntries = async () => {
    getEntriesLoading.value = true;
    let response = await auth.query(
      process.env.VUE_APP_URL + '/api/resource',
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

    getEntriesLoading.value = false;
    let entries = await response.json();
    for (let i = 0; i < entries.length; i++) {
      entries[i].createdAt = new Date(entries[i].createdAt);
    }
    return entries;
  };
  return {
    getEntries,
    getEntriesLoading
  };
}

export function useSaveDialogForm(auth: Auth, entry: SaveDialogFormTemplate ) {
  let saveDialogFormLoading = ref(false);
  const saveDialogForm = async () => {
    saveDialogFormLoading.value = true;
    console.log('Saving...');
    console.log(entry);
    let res = await auth.query(
      process.env.VUE_APP_URL + '/api/resource',
      {
        scopes: [
          process.env.VUE_APP_SCOPE_WRITE,
          process.env.VUE_APP_SCOPE_READ
        ]
      },
      'POST',
      {
        title: entry.title.value,
        description: entry.description.value,
        url: entry.url.value
      }
    );
    console.log(res);
    saveDialogFormLoading.value = false;
  };
  return { saveDialogForm, saveDialogFormLoading };
}