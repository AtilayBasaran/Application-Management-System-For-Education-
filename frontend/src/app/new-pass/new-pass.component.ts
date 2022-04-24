import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TokenStorageService } from '../services/token-storage.service';
import { PasswordChangeService } from '../services/password-change.service';
import { ActivatedRoute , Router} from "@angular/router";

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss']
})
export class NewPassComponent implements OnInit {
  newPassForm: FormGroup;
  email = '' ; 
  errorMessage = '' ; 
  isNewPassFailed = false;

  constructor(private route: ActivatedRoute, private passwordService : PasswordChangeService, private router: Router) { }

  ngOnInit(): void {
    this.newPassForm = this.createFormGroup();
    //Type conversion yapıyorum burda 
    this.email = this.route.snapshot.paramMap.get('email') || "";
    console.log(this.email)

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

  newPassword(): void {
    console.log('Buraya geldim mi ?')
    console.log(this.email)
    this.passwordService
      .newPassword(this.email, this.newPassForm.value.password, this.newPassForm.value.passwordConfirm)
      .subscribe(data => {
        console.log(data);
        this.isNewPassFailed = false;
        this.router.navigate(['successRegister'])
        .then(() => {
        window.location.reload();
      });
      },
      err => {
        this.errorMessage = err.error.message;
        this.isNewPassFailed = true;
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