import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class PasswordChangeService {
  currentUser: any;
  private url = "http://localhost:3000/pass";
 

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  changePassword(email : String, password: String, passwordConfirm : String): Observable<any> {
    console.log('servisin içi ')
    return this.http
      .post(`${this.url}/changepass`,{email,password,passwordConfirm}, this.httpOptions);
  }
}
