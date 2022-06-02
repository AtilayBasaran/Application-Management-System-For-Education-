import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InstituteGuard implements CanActivate {
  roles: string;
  constructor(private token: TokenStorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.token.getToken()) {
      const user = this.token.getUser();
      this.roles = user.roles;
      if (this.roles == 'institute') {
        return true;
      } else {
        this.router.navigate(["/hodApplication"]);

        return false;
      }

    } else {
      this.router.navigate(["/authorized"]);
      return false;
    }
  }
  
}
