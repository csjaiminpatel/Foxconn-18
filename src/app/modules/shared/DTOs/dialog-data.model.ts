export interface DialogData {
  title: string;
  content: string;
  subContent?: string;
  button: string;
  cancelButton: string;
  insertFile: string;
  positiveBtnColor: string;
  disableClose?: boolean;
  hideClose?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideActions?: boolean;
}
