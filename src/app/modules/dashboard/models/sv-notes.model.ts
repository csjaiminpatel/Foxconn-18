export interface SVNotesResult {
  count: number;
  result: SVNotes[];
}

export interface SVNotes {
  modul: string;
  key: string;
  text: string;
  id?: string;
  dateOfComment?: Date;
  hasUpdate?: boolean;
  commentByName?: string;
  commentById?: string;
}
