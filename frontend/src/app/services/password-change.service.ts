import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";


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
    console.log('Change Password Servisinin içi ')
    return this.http
      .post(`${this.url}/changepass`,{email,password,passwordConfirm}, this.httpOptions);
  }

  forgetPassword(email : String): Observable<any> {
    console.log('Forget Password Servisinin içi ')
    return this.http
      .post(`${this.url}/forgetpass`,{email}, this.httpOptions);
  }

  newPassword(email : String,password: String, passwordConfirm : String): Observable<any> {
    console.log('New Password Servisinin içi ')
    return this.http
      .post(`${this.url}/newpass`,{email,password,passwordConfirm}, this.httpOptions);
  }
}
