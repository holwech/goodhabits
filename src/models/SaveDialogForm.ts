export interface SaveDialogForm {
  title: string;
  description: string;
  url: string;
}

export interface SaveDialogFormElement {
  value: string;
  rules: Array<(v: string) => any>;
}

export interface SaveDialogFormTemplate {
  title: SaveDialogFormElement;
  description: SaveDialogFormElement;
  url: SaveDialogFormElement;
}