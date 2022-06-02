import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.tokenStorage.getToken()) {

      if(this.tokenStorage.getUser().roles == 'student'){
        return true;
      }
      else{
        this.router.navigate(["/notFound"])
        return true;
      }

    } else {
      this.router.navigate(["/login"]);
      return true;
    }
  }

}
