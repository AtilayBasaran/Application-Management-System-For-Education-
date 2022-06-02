import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HeadOfDeptGuard implements CanActivate {
  userRole: string;
  constructor(private token: TokenStorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.token.getToken()) {
      
      this.userRole = this.token.getUser().roles;
      console.log('bak bakalım'+ this.userRole)
      if (this.userRole == 'headOfDept') {
        console.log('buraya girdi mi ')
        return true;
      
      } else {
        console.log('Yoksa burada mı ? ')
        this.router.navigate([""]);

        return false;
      }

    } else {
      return true;
    }
  }

}