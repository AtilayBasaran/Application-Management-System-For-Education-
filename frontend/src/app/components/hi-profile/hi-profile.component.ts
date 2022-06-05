import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesService } from 'src/app/services/upload-file.service';
import { PasswordChangeService } from '../../services/password-change.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Component({
  selector: 'app-hi-profile',
  templateUrl: './hi-profile.component.html',
  styleUrls: ['./hi-profile.component.scss'],
})
export class HiProfileComponent implements OnInit {

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  columnsToDisplay: string[] = ['name', 'register_date', 'program', 'email', 'agency_mail', 'stage', 'examine'];
  turkishApplicationInfos: any;
  internationalApplicationInfos: any;
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;
  isChangePassFailed = false;
  currentUser: any;
  changePassForm: FormGroup;
  errorMessage = '' ; 

  @ViewChild('MatPaginator1', { static: true }) paginator: MatPaginator;
  @ViewChild('MatPaginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('matsort1', { static: true }) sort: MatSort;
  @ViewChild('matsort2', { static: true }) sort2: MatSort;

  constructor(private token: TokenStorageService,private modalService: NgbModal,private passwordService : PasswordChangeService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.turkishApplicationInfos = this.getTurkishApplicationInfos();
    this.internationalApplicationInfos = this.getInternationalApplicationInfos();
    this.currentUser = this.token.getUser();
    this.changePassForm = this.createFormGroup();
    console.log(this.currentUser)
  }

  open2(user_id: any) {

    const firstModal = this.modalService.open(NgbdModal6Content, { size: 'xl' });
    firstModal.componentInstance.user_id = user_id;

    firstModal.closed.subscribe(() => this.ngOnInit());

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

  getTurkishApplicationInfos() {
    var user_id = this.token.getUser().id;
    this.http.post('http://localhost:3000/home/postTurkishApplicationInfo',{user_id}, this.httpOptions).subscribe(data => {

      this.turkishApplicationInfos = data;
      this.dataSource = new MatTableDataSource(this.turkishApplicationInfos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('Application infos')

    });
  }
  getInternationalApplicationInfos() {
    var user_id = this.token.getUser().id;
      this.http.post('http://localhost:3000/home/postInternationalApplicationInfo',{user_id}, this.httpOptions).subscribe(data => {
        this.internationalApplicationInfos = data;
        this.dataSource2 = new MatTableDataSource(this.internationalApplicationInfos);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        console.log(data)
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

@Component({
  template: `
  <form [formGroup]="schoolarShipForm" id="msform">
  <h2 style="text-align: center; font-size:30px;">All Information</h2>
      <mat-accordion>
          <mat-expansion-panel (opened)="panelOpenState = true" (closed)="panelOpenState = false">
              <mat-expansion-panel-header>
                  <mat-panel-title class="title" style="font-size:20px;">
                      Documents
                  </mat-panel-title>
              </mat-expansion-panel-header>
              <table class="table table-striped">
                  <thead>
                      <tr>
                          <th scope="col">Title</th>
                          <th scope="col">Document Name</th>
                      </tr>
                  </thead>
                  <tbody *ngFor="let file of fileInfos">
                  <tr>
                      <td>
                          <p>{{ file.title }}</p>
                      </td>
                      <td>
                          <a href="{{ file.url }}">{{ file.name }}</a>
                      </td>
                  </tr>
              </tbody>
              </table>
          </mat-expansion-panel>
          <mat-expansion-panel (opened)="panelOpenState = true" (closed)="panelOpenState = false">
              <mat-expansion-panel-header>
                  <mat-panel-title class="title" style="font-size:20px;">
                      Status
                  </mat-panel-title>
              </mat-expansion-panel-header>
              <p> Application status :   </p>
              <p> Scientific : </p>
          </mat-expansion-panel>
          <mat-expansion-panel (opened)="panelOpenState = true" (closed)="panelOpenState = false">
              <mat-expansion-panel-header>
                  <mat-panel-title class="title" style="font-size:20px;">
                      Add Course
                  </mat-panel-title>
              </mat-expansion-panel-header>
              <p> Course name :  </p>
          </mat-expansion-panel>
          <mat-expansion-panel (opened)="panelOpenState = true" (closed)="panelOpenState = false">
              <mat-expansion-panel-header>
                  <mat-panel-title class="title" style="font-size:20px;">
                      Interview
                  </mat-panel-title>
              </mat-expansion-panel-header>
              <p> Interview : </p>
          </mat-expansion-panel>
          <mat-expansion-panel (opened)="panelOpenState = true" (closed)="panelOpenState = false">
              <mat-expansion-panel-header>
                  <mat-panel-title class="title" style="font-size:20px;">
                      Schoolarship
                  </mat-panel-title>
              </mat-expansion-panel-header>
              <p> Schoolarship :  </p>
          </mat-expansion-panel>
      </mat-accordion>
      </form>
  `
})

export class NgbdModal6Content {
  @Input() user_id: any;
  fileInfos: any;
  panelOpenState = false;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  schoolarShipForm !: FormGroup;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private uploadService: UploadFilesService, private http: HttpClient, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUniqueUserFiles(this.user_id);


    console.log(this.fileInfos)

  }

  // getCourseInfos() {
  //   var user_id = this.user_id;
  //   this.http.post('http://localhost:3000/app/getCourseInfos', { user_id }, this.httpOptions).subscribe(data => {
  //     this.courseInfos = data;
  //     console.log(data)

  //     console.log('Course infos')

  //     console.log(this.courseInfos)
  //   });
  // }
  // getUserCourses(user_id: any) {
  //   var user_id = this.user_id;
  //   this.http.post('http://localhost:3000/app/getUserCourses', { user_id }, this.httpOptions).subscribe(data => {
  //   this.userCourses = data;
  //     console.log(data)
  //   });
  // }

  getUniqueUserFiles(user_id: any): void {
    this.http.post('http://localhost:3000/app/getUniqueUserFiles', { user_id }, this.httpOptions).subscribe(data => {
      this.fileInfos = data;
      console.log(data)

      console.log('User File infos')

      console.log(this.fileInfos)
    });

  }

}
