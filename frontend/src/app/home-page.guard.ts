import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HomePageGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.tokenStorage.getToken()) {

      if(this.tokenStorage.getUser().roles == 'student'){
        this.router.navigate(["/profile"]);
        return false;
      }else if (this.tokenStorage.getUser().roles == 'headOfDept'){
        this.router.navigate(["/hodApplication"]);
        return false;
      }else if (this.tokenStorage.getUser().roles == 'institute'){
        this.router.navigate(["/institute"]);
        return false;
      }else if (this.tokenStorage.getUser().roles == 'agency'){
        this.router.navigate(["/agencyProfile"]);
        return false;
      }
      
      return false;
    } else {
      this.router.navigate(["/login"]);
      return true;
    }
  }
  
}
