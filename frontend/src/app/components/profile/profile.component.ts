import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TokenStorageService } from '../../services/token-storage.service';
import { PasswordChangeService } from '../../services/password-change.service';
import { ActivatedRoute , Router} from "@angular/router";
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  appInfo: any;
  changePassForm: FormGroup;
  errorMessage = '' ; 
  isChangePassFailed = false;
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(private token: TokenStorageService ,private _liveAnnouncer: LiveAnnouncer,private http: HttpClient, private passwordService : PasswordChangeService, private router: Router) { }
  ngOnInit() : void{
    this.currentUser = this.token.getUser();
    this.appInfo = this.getApplicationDetail();
    this.changePassForm = this.createFormGroup();
    console.log('deneme')

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
    this.http.get('http://localhost:3000/home/getApplicationInfo').subscribe(data => {
      this.appInfo = data;
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