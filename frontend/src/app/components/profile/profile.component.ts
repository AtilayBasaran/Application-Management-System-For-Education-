import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TokenStorageService } from '../../services/token-storage.service';
import { PasswordChangeService } from '../../services/password-change.service';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  appInfos: any;
  deneme:any;
  changePassForm: FormGroup;
  errorMessage = '' ; 
  isChangePassFailed = false;
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(private token: TokenStorageService ,private http: HttpClient, private passwordService : PasswordChangeService, private router: Router) { }
  ngOnInit() : void{
    this.currentUser = this.token.getUser();
    console.log('deneme');
    this.deneme = this.getUserInfos();
    this.changePassForm = this.createFormGroup();
    console.log('hop'+this.currentUser)

  };

  createFormGroup(): FormGroup {
    return new FormGroup({
      password: new FormControl("", [Validators.required, Validators.minLength(7), matchValidator('passwordConfirm', true)]),
      passwordConfirm: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        matchValidator('password'),
      ]),
    });
  };
  

  changePassword(): void {
    const email = this.currentUser.email;
    console.log(this.changePassForm.value.password);
    console.log(email)
    this.passwordService
      .changePassword(email, this.changePassForm.value.password, this.changePassForm.value.passwordConfirm)
      .subscribe(
        data => {
          console.log(data);
          this.isChangePassFailed = false;
          this.router.navigate(['successRegister'])
          .then(() => {
          window.location.reload();
        });
        },
        err => {
          this.errorMessage = err.error.message;
          this.isChangePassFailed = true;
        });
  };

  reloadPage(): void {
    window.location.reload();
  };

  getProfileApplicationDetail() : any {
    var user_id = this.token.getUser().id;
    var user_infos ;
    this.http.get('http://localhost:3000/home/getProfileApplicationDetail/'+user_id).subscribe(data => {
      user_infos = data;
    });
    return user_infos;
  }

  getApplicationDetail() {
    var user_id = this.token.getUser().id;
    this.http.post('http://localhost:3000/home/getProfileApplicationDetail',{user_id}, this.httpOptions ).subscribe(data => {
      this.appInfos = data;
      this.deneme = this.appInfos
      console.log(this.deneme)
    });
  }
  getUserInfos() {
    this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
      this.appInfos = data;
      console.log(data)
  
      console.log('user infos')
  
      console.log(this.appInfos)
    });
  }
}



export function matchValidator(
  matchTo: string, 
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl): 
  ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value === 
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}