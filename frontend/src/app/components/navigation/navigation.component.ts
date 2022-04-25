import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isLoggedIn = false;
  showAdminBoard = false;
  showHeadBoard = false;
  showStudentBoard = false;
  firstname?: string;
  roles = ''

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      console.log(user.roles)

      if(user.roles == 'institute' ){
        this.showAdminBoard = true;
      }else if(user.roles == 'headOfDept'){
        this.showHeadBoard = true;
      }else{
        this.showStudentBoard = true;
      }
    }
    
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
