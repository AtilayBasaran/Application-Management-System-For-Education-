import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TokenStorageService } from '../../services/token-storage.service';
import { PasswordChangeService } from '../../services/password-change.service';
import { ActivatedRoute , Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  changePassForm: FormGroup;
  errorMessage = '' ; 
  isChangePassFailed = false;

  constructor(private token: TokenStorageService , private passwordService : PasswordChangeService, private router: Router) { }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.changePassForm = this.createFormGroup();
    console.log(this.currentUser)
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      password: new FormControl("", [Validators.required, Validators.minLength(7), matchValidator('passwordConfirm', true)]),
      passwordConfirm: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        matchValidator('password'),
      ]),
    });
  }
  

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
  }
  reloadPage(): void {
    window.location.reload();
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