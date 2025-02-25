export interface SVComments {
  modul: string;
  key: string;
  text?: string;
  id?: string;
  dateModified?: Date;
  createdBy?: string;
  modifiedBy?: string;
  modifiedName?: string;
  createdName?: string;
  commentByName?: string;
  commentById?: string;
  dateOfComment?: string;
}

export interface SVCommentsEdited extends SVComments {
  isLoggedUserAuthor: boolean;
}
