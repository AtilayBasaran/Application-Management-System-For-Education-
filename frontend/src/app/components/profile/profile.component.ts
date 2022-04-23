import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TokenStorageService } from '../../services/token-storage.service';
import { PasswordChangeService } from '../../services/password-change.service';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  changePassForm: FormGroup;

  constructor(private token: TokenStorageService , private passwordService : PasswordChangeService) { }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.changePassForm = this.createFormGroup();
    console.log(this.currentUser)
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      password: new FormControl("", [Validators.required, Validators.minLength(7)]),
      passwordConfirm: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }
  

  changePassword(): void {
    console.log('Buraya geldim mi ?')
    const email = this.currentUser.email;
    console.log(this.changePassForm.value.password);
    console.log(email)
    this.passwordService
      .changePassword(email, this.changePassForm.value.password, this.changePassForm.value.passwordConfirm)
      .subscribe();
  }
  
}