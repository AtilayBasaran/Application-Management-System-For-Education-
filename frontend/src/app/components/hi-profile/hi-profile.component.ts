import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { PasswordChangeService } from '../../services/password-change.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Component({
  selector: 'app-hi-profile',
  templateUrl: './hi-profile.component.html',
  styleUrls: ['./hi-profile.component.scss'],
})
export class HiProfileComponent implements OnInit {
  columnsToDisplay : string[] = ['id','firstname','lastname','email','role'];
  userInfos: any;
  dataSource: MatTableDataSource<any>;
  isChangePassFailed = false;
  currentUser: any;
  changePassForm: FormGroup;
  errorMessage = '' ; 

  constructor(private token: TokenStorageService,private passwordService : PasswordChangeService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {}//buraya daha sonra database gelecek

  @ViewChild('MatPaginator1', {static: true}) paginator: MatPaginator; 
  @ViewChild('matsort1', {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
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

  getUserInfos() {
    this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
      this.userInfos = data;
      this.dataSource = new MatTableDataSource(this.userInfos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(data)

      console.log('user infos')

      console.log(this.userInfos)
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
