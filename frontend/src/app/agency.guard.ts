import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AgencyGuard implements CanActivate {
  userRole: string;
  constructor(private token: TokenStorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.token.getToken()) {
      
      this.userRole = this.token.getUser().roles;

      if (this.userRole == 'agency') {
        return true;
      
      } else {
        this.router.navigate(["/authorized"]);

        return false;
      }

    } else {
      return true;
    }
  }
  
}