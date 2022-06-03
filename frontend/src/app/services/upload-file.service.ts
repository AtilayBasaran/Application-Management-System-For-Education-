import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'http://localhost:3000';
  constructor(private token: TokenStorageService ,private http: HttpClient) { }


  upload(file: File , documentTitle : string, id : any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('documentTitle', documentTitle)
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/upload/${id}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  getFiles(id :any): any {
    return this.http.post(`${this.baseUrl}/files`, {id});
  }

  getUniqueUserFiles(user_id : any): any {
    return this.http.post(`${this.baseUrl}/files/getUniqueUserFiles`, {user_id});
  }

  deleteFiles(document_url: String, id : any, file_name : any): Observable<any> {

    return this.http.post(`${this.baseUrl}/files/delete`, {document_url, id, file_name});
  }
}