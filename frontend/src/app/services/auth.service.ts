import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject } from "rxjs";
import { first, catchError, tap } from "rxjs/operators";

import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "http://localhost:3000/auth";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id">;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions);
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<any> {
    return this.http
      .post(`${this.url}/login`, { email, password }, this.httpOptions)
  }
}
