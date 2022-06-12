import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router, private http: HttpClient) { }
  isDid: string;
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.tokenStorage.getToken()) {

      if (this.tokenStorage.getUser().roles == 'student') {
        var user_id = this.tokenStorage.getUser().id
        this.http.post('http://localhost:3000/app/isCreateApplication', { user_id }, this.httpOptions).subscribe(data => {
          console.log('data', data)
          if (data == true) {
            this.router.navigate(["/authorized"])
          return false;
          } else {
            return true;
          }
        });
        return true;
      } else {
        this.router.navigate(["/authorized"])
        return true;
      }
    } else {
      this.router.navigate(["/login"]);
      return true;
    }
  }

  isCreateApplication(): any {
    var user_id = this.tokenStorage.getUser().id;

  }
}
