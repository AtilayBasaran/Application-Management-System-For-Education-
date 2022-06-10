import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Data, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from 'ngx-toastr';
import { PasswordChangeService } from '../../services/password-change.service';


@Component({
  selector: 'app-agency-profile',
  templateUrl: './agency-profile.component.html',
  styleUrls: ['./agency-profile.component.scss'],
})
export class AgencyProfileComponent implements OnInit {
  columnsToDisplay : string[] = ['id','firstname','lastname','email','role','actions'];
  displayToColumn: string[] = ['name', 'register_date', 'program', 'email', 'agency_mail', 'stage'];
  userInfos: any;
  applicationInfos: any;
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;
  signupForm!: FormGroup;
  formBuilder: FormBuilder;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  changePassForm: FormGroup;
  isChangePassFailed = false;
  currentUser: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private authService: AuthService,private token: TokenStorageService,private passwordService : PasswordChangeService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {}

  @ViewChild('matsort1', {static: true}) sort: MatSort;
  @ViewChild('MatPaginator1', {static: true}) paginator: MatPaginator; 
  @ViewChild('matsort2', {static: true}) sort2: MatSort;
  @ViewChild('MatPaginator2', {static: true}) paginator2: MatPaginator; 

  ngOnInit(): void {
    this.userInfos = this.agencyUserDetails();
    this.applicationInfos = this.getAgencyApplicationInfos();
    this.signupForm = this.createFormGroup();
    this.currentUser = this.token.getUser();
    this.changePassForm = this.createFormGroup();
    console.log(this.currentUser)
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      firstname: new FormControl("", [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        matchValidator('confirmPassword', true)
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        matchValidator('password'),
      ]),
    },
    );
  }
  createUser(): void {
    var agency_email = this.token.getUser().email;
    this.authService
    .createUser(this.signupForm.value, agency_email)
    .subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.toastr.success('User Created Successfully', 'Success')
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.toastr.error(this.errorMessage, 'Error')
      }
    );
  }

  agencyUserDetails() {
    var agency_email = this.token.getUser().email;
    this.http.post('http://localhost:3000/settings/agencyUserDetails', {agency_email}, this.httpOptions).subscribe(data => {
      this.userInfos = data;
      this.dataSource = new MatTableDataSource(this.userInfos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(data)

      console.log('user infos')

      console.log(this.userInfos)
    });
  }

  getAgencyApplicationInfos() {
    var email = this.token.getUser().email;
    this.http.post('http://localhost:3000/home/getAgencyApplicationInfo',{email},this.httpOptions).subscribe(data => {
      this.applicationInfos = data;
      this.dataSource2 = new MatTableDataSource(this.applicationInfos);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
      console.log(data)

      console.log('Application infos')

    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLocaleLowerCase();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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