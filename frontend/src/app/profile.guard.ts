import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.tokenStorage.getToken()) {
        var userRole = this.tokenStorage.getUser().roles;
        if(userRole == 'student'){
          return true;
        }else{
          this.router.navigate(["/agencyProfile"]);
        return false;
        }
      } else {
        this.router.navigate(["/authorized"]);
        return false;
      }
  }
  
}
