import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../services/config.service';
import { SVNotesResult, SVNotes } from '../../models/sv-notes.model';


@Injectable()
export class SupplyVisibilityNotesService {
  apiUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  /**
   * Get API URL for Get Notes by Record
   * @param modul
   * @param key
   * @param searchText
   * @param top
   * @param skip
   * @returns
   * @memberof SupplyVisibilityNotesService
   **/

  getSVNotesByRecord(modul: string, key: string, searchText?: string, top?: number, skip?: number) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getNotesByRecord}`;

    let params = new HttpParams();
    params = params.append('modul', modul);
    params = params.append('key', key.toUpperCase());
    if (searchText !== null && searchText !== undefined) {
      params = params.append('searchText', searchText);
    }
    if (top !== null && top !== undefined) {
      params = params.append('$top', top.toString());
    }
    if (skip !== null && skip !== undefined) {
      params = params.append('$skip', skip.toString());
    }

    return this.http.get<SVNotesResult>(url, { params: params });
  }

  /**
   * Get API URL for Get Notes by User ID
   * @param userId
   * @param modul
   * @param key
   * @param searchText
   * @param top
   * @param skip
   * @returns
   * @memberof SupplyVisibilityNotesService
   **/

  getSVNotesByUser(
    userId: number,
    modul?: string,
    key?: string,
    searchText?: string,
    top?: number,
    skip?: number
  ) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getNotesByUser}`;

    let params = new HttpParams();
    params = params.append('userid', userId.toString());
    if (modul) {
      params = params.append('modul', modul);
    }
    if (key) {
      params = params.append('key', key);
    }
    if (searchText) {
      params = params.append('searchText', searchText);
    }
    if (top) {
      params = params.append('$top', top.toString());
    }
    if (skip) {
      params = params.append('$skip', skip.toString());
    }

    return this.http.get<SVNotes[]>(url, { params: params });
  }

  createSVNote(data: SVNotes) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.createSVNote}`;
    return this.http.post<SVNotes>(url, data);
  }

  updateSVNote(data: SVNotes) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.updateSVNote}`;
    return this.http.post<SVNotes>(url, data);
  }

  deleteSVNote(data: SVNotes) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.deleteSVNote}`;
    return this.http.delete<SVNotes>(`${url}/${data.id}`);
  }
}
