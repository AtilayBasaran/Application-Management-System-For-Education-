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
  upload(file: File , documentTitle : string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('documentTitle', documentTitle)
    const currentUser = this.token.getUser();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/upload/${currentUser.id}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  getFiles(): Observable<any> {
    const currentUser = this.token.getUser();
    const id = currentUser.id;
    return this.http.post(`${this.baseUrl}/files`, {id});
  }

  deleteFiles(document_url: String): Observable<any> {
    const currentUser = this.token.getUser();
    const id = currentUser.id;
    return this.http.post(`${this.baseUrl}/files/delete`, {document_url});
  }
}