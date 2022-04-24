import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PasswordChangeService } from '../../services/password-change.service';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {
  forgetForm: FormGroup;
  isForgetFailed = false;
  errorMessage = '';

  constructor(private router: Router, private passwordService : PasswordChangeService) { }

  ngOnInit(): void {
    this.forgetForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }

  forgetPass(): void {
    console.log('login içine girdi')
    this.passwordService
      .forgetPassword(this.forgetForm.value.email)
      .subscribe(
        data => {
          console.log(data);

          this.isForgetFailed = false;

          this.router.navigate(['profile'])
          .then(() => {
          window.location.reload();
        });
        },
        err => {
          this.errorMessage = err.error.message;
          this.isForgetFailed = true;
        }
        );
  }

}
