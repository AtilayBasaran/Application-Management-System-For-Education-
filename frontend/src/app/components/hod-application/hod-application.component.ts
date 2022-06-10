import { Component, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { HomePageService } from 'src/app/services/home-page.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesService } from 'src/app/services/upload-file.service';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-hod-application',
  templateUrl: './hod-application.component.html',
  styleUrls: ['./hod-application.component.scss']
})
export class HodApplicationComponent implements OnInit {
  
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  columnsToDisplay: string[] = ['name', 'register_date', 'program', 'email', 'agency_mail', 'stage', 'actions', 'examine', 'interview'];
  turkishApplicationInfos: any;
  internationalApplicationInfos: any;
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;
  modalsNumber = 0;

  @ViewChild('MatPaginator1', { static: true }) paginator: MatPaginator;
  @ViewChild('MatPaginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('matsort1', { static: true }) sort: MatSort;
  @ViewChild('matsort2', { static: true }) sort2: MatSort;

  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService, private modalService: NgbModal, private homePageService: HomePageService) {
    this.modalService.activeInstances.subscribe((list) => { this.modalsNumber = list.length; });

  }

  ngOnInit(): void {
    this.turkishApplicationInfos = this.getTurkishApplicationInfos();
    this.internationalApplicationInfos = this.getInternationalApplicationInfos();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLocaleLowerCase();
  }

  open(user_id: any , user_stage : any) {
    if(user_stage == 'HeadOfDept'){
      const headModal = this.modalService.open(NgbdModal3Content, { size: 'xl' });
      headModal.componentInstance.user_id = user_id;
  
      headModal.closed.subscribe(() => this.ngOnInit());
    }else if(user_stage == 'Interview'){
      const interviewModal = this.modalService.open(NgbdModal7Content, { size: 'xl' });
      interviewModal.componentInstance.user_id = user_id;
  
      interviewModal.closed.subscribe(() => this.ngOnInit());
    }else{
      this.toastr.success('Interview Request Sended Successfully', 'Success')
    }



  }

  open2(user_id: any) {

    const firstModal = this.modalService.open(NgbdModal5Content, { size: 'xl' });
    firstModal.componentInstance.user_id = user_id;

    firstModal.closed.subscribe(() => this.ngOnInit());

  }

  open3(user_id: any) {

    const firstModal = this.modalService.open(NgbdModal7Content, { size: 'xl' });
    firstModal.componentInstance.user_id = user_id;

    firstModal.closed.subscribe(() => this.ngOnInit());

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

}
@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './progress.html',
  styleUrls: ['./progress.scss']
})
export class NgbdModal3Content implements OnInit {
  @Input() user_id: any;
  fileInfos: any;
  showMe: boolean = false;
  panelOpenState = false;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  choices: string[] = ['Agree', 'Reject'];
  agreeOrNot: string;
  scientificOrNot: string;
  interviewAgree: string;
  chooseSchoolar: string;

  status_step = false;
  interview_step = false;
  addCourse_step = false;
  upload_step = false;
  education_step = false;
  document_step = false;
  is_agreed = false;
  is_scientific = false;
  is_interview = false;
  statusDetail !: FormGroup;
  interviewForm !: FormGroup;
  courseInfos: any;
  selectedCourse: string;
  courseDetails !: FormGroup;
  schoolarShipForm !: FormGroup;
  userCourses: any;
  programQuotaInfo: any;

  step = 1;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private uploadService: UploadFilesService, private http: HttpClient, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.getUniqueUserFiles(this.user_id);


    console.log(this.fileInfos)

    this.statusDetail = this.formBuilder.group({
      isAgree: ['', Validators.required],
      isScientific: ['', Validators.required],
    });

    this.courseDetails = this.formBuilder.group({
      selectedCourse: [null]
    })

    this.schoolarShipForm = this.formBuilder.group({
      schoolarChoice: [null, Validators.required]
    })

    this.interviewForm = this.formBuilder.group({
      isInterviewAgree: [null, Validators.required]
    })

  }

  get status() { return this.statusDetail.controls; }
  get interview() { return this.interviewForm.controls; }
  get course() { return this.courseDetails.controls; }
  get schoolar() { return this.schoolarShipForm.controls; }

  hiddenScientific() {
    this.showMe = !this.showMe;
  }

  isAgree(choice: any): void {
    if (choice == 'Agree') {
      this.is_agreed = true;
    } else if (choice == 'Reject') {
      this.is_agreed = false;
    }
  }
  isScientific(choice: any): void {
    if (choice == 'Yes') {
      this.is_scientific = true;
    } else if (choice == 'No') {
      this.is_scientific = false;
    }
  }
  changeInterview(choice: any): void {
    if (choice == 'Yes') {
      this.is_interview = true;
    } else if (choice == 'No') {
      this.is_interview = false;
    }
  }

  next() {

    if (this.step == 1) {
      this.document_step = true;
      this.step++;
    }
    else if(this.step == 2) {
      this.interview_step = true;
      if (this.interviewForm.invalid) { return }
      this.step++;
    }
    else if (this.step == 3) {
      this.status_step = true;
      if (this.statusDetail.invalid) { return }

      this.getprogramQuotaInfos();

      if (this.is_scientific) {
        this.step++;
        this.getCourseInfos();
        this.getUserCourses(this.user_id);
        console.log(this.courseInfos)
      } else {
        this.step = 5;
      }
    }
    else if (this.step == 4) {
      this.addCourse_step = true;
      if (this.courseDetails.invalid) { return }
      this.step++;
    }
    else if(this.step == 5) {
      this.step++;
    }


  }

  previous() {
    if (this.step == 5 && !this.is_scientific) {
      this.step -= 2;
    } else {
      

      if (this.step == 1) {
        this.document_step = false;
      }
      if (this.step == 2) {
        this.step--
      }
      if (this.step == 3) {
        this.status_step = false;
        this.step--
      }
      if (this.step == 4) {
        this.addCourse_step = false;
        this.step--
      }
      if (this.step == 5) {
        this.step--
      }
      if (this.step == 6) {
        this.step--
      }
    }

  }
  submit() {
    if (this.step == 6) {

      if (this.schoolarShipForm.invalid) { return }
      this.approveApplication()
    }
  }




  reject(user_id: any) {
    const secondModal = this.modalService.open(NgbdModal4Content, { size: 'lg' });
    secondModal.componentInstance.user_id = user_id;
    secondModal.closed.subscribe(() => this.activeModal.close('true'));

  }

  sendInterviewRequest(user_id: any) {
    console.log(user_id)

    this.http.post('http://localhost:3000/app/sendInterviewRequest', { user_id }, this.httpOptions).subscribe(data => {

      if(data == true){
        this.toastr.success('Interview Request Sended Successfully', 'Success')
        this.activeModal.close();
      }
  
      });

  }

  getprogramQuotaInfos() {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/getProgramQuotaInfos', { user_id }, this.httpOptions).subscribe(data => {
      this.programQuotaInfo = data;
      console.log(data)

      console.log('Course infos')

      console.log(this.programQuotaInfo)
    });
  }

  approveApplication() {
    var user_id = this.user_id;
    var schoolar = this.schoolarShipForm.value.schoolarChoice
    this.http.post('http://localhost:3000/app/approveApplication', { user_id , schoolar }, this.httpOptions).subscribe(data => {

    if(data == true){
      this.toastr.success('Application approved Successfully', 'Success')
      this.activeModal.close();
    }

    });
  }


  getCourseInfos() {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/getCourseInfos', { user_id }, this.httpOptions).subscribe(data => {
      this.courseInfos = data;
      console.log(data)

      console.log('Course infos')

      console.log(this.courseInfos)
    });
  }

  addCourse(course_name: string, user_id: any) {
    console.log(user_id, course_name)

    this.http.post('http://localhost:3000/app/controlAdded', { user_id, course_name }, this.httpOptions).subscribe(data => {
      console.log(data)

    if(data == true){
      this.toastr.error('This course already added please choose another one', 'Error')
    }else{
      this.http.post('http://localhost:3000/app/addCourse', { user_id, course_name }, this.httpOptions).subscribe(data => {

        this.getUserCourses(this.user_id);
        console.log('Course infos')
        this.toastr.success('Course Added Successfully', 'Success')
  
      });
    }
  });


  }

  removeCourse(course_name: string, user_id: any) {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/removeCourse', { user_id, course_name }, this.httpOptions).subscribe(data => {
      this.getUserCourses(this.user_id);
      console.log(data)

      this.toastr.success('Course Removed Successfully', 'Success')
    });
  }

  getUserCourses(user_id: any) {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/getUserCourses', { user_id }, this.httpOptions).subscribe(data => {
    this.userCourses = data;
      console.log(data)
    });
  }


  getUniqueUserFiles(user_id: any): void {
    this.http.post('http://localhost:3000/app/getUniqueUserFiles', { user_id }, this.httpOptions).subscribe(data => {
      this.fileInfos = data;
      console.log(data)

      console.log('User File infos')

      console.log(this.fileInfos)
    });

  }
}



@Component({
  template: `
  <div class="modal-header">
  <h4 class="modal-title"> Enter a reject reason </h4>
  <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
</div>
<form [formGroup]="rejectForm" (ngSubmit)="rejectDocument()" novalidate>
<div class="modal-body">

<label>Reject Reason</label> <br>
<input id="reason" type="text" formControlName="reason" >
<div *ngIf="rejectForm.get('reason')?.errors?.required"> 
<p> *Required </p> 
</div>
</div>

<div class="modal-footer">
  <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('false')">Close</button>
  <button color="accent" class="btn btn-outline-dark" [disabled]="!rejectForm.valid" clicktype="submit">
  <span>Reject</span>
</button>

</div>
</form>
  `
})
export class NgbdModal4Content implements OnInit {
  @Input() user_id: any;
  @Input() file_name: string;
  rejectForm: FormGroup;
  constructor(public activeModal: NgbActiveModal, private homePageService: HomePageService, private toastr: ToastrService, private applicationService: ApplicationService) { }
  ngOnInit(): void {
    this.rejectForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      reason: new FormControl("", [Validators.required]),
    });
  }

  rejectDocument(): void {
    console.log('Reject Çalıştı')
    console.log('reason = ' + this.rejectForm.value.reason)
    this.applicationService
      .rejectApplication(this.user_id, this.rejectForm.value.reason)
      .subscribe(data => {
        if(data == true){
          this.activeModal.close('true')
        }
        


      },
        err => {
        });
  }
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

export class NgbdModal5Content {
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

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './progress_interview.html',
  styleUrls: ['./progress_interview.scss']
})
export class NgbdModal7Content implements OnInit {
  @Input() user_id: any;
  fileInfos: any;
  showMe: boolean = false;
  panelOpenState = false;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  choices: string[] = ['Agree', 'Reject'];
  agreeOrNot: string;
  scientificOrNot: string;
  interviewAgree: string;
  chooseSchoolar: string;

  status_step = false;
  interview_step = false;
  addCourse_step = false;
  upload_step = false;
  education_step = false;
  document_step = false;
  is_agreed = false;
  is_scientific = false;
  is_interview = false;
  statusDetail !: FormGroup;
  interviewForm !: FormGroup;
  courseInfos: any;
  selectedCourse: string;
  courseDetails !: FormGroup;
  schoolarShipForm !: FormGroup;
  userCourses: any;
  programQuotaInfo: any;

  step = 1;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private uploadService: UploadFilesService, private http: HttpClient, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.getUniqueUserFiles(this.user_id);


    console.log(this.fileInfos)

    this.statusDetail = this.formBuilder.group({
      isAgree: ['', Validators.required],
      isScientific: ['', Validators.required],
    });

    this.courseDetails = this.formBuilder.group({
      selectedCourse: [null]
    })

    this.schoolarShipForm = this.formBuilder.group({
      schoolarChoice: [null, Validators.required]
    })

    this.interviewForm = this.formBuilder.group({
      isInterviewAgree: [null, Validators.required]
    })

  }

  get status() { return this.statusDetail.controls; }
  get interview() { return this.interviewForm.controls; }
  get course() { return this.courseDetails.controls; }
  get schoolar() { return this.schoolarShipForm.controls; }

  hiddenScientific() {
    this.showMe = !this.showMe;
  }

  isAgree(choice: any): void {
    if (choice == 'Agree') {
      this.is_agreed = true;
    } else if (choice == 'Reject') {
      this.is_agreed = false;
    }
  }
  isScientific(choice: any): void {
    if (choice == 'Yes') {
      this.is_scientific = true;
    } else if (choice == 'No') {
      this.is_scientific = false;
    }
  }
  changeInterview(choice: any): void {
    if (choice == 'Yes') {
      this.is_interview = true;
    } else if (choice == 'No') {
      this.is_interview = false;
    }
  }

  next() {

    if (this.step == 1) {
      this.status_step = true;
      if (this.statusDetail.invalid) { return }

      this.getprogramQuotaInfos();

      if (this.is_scientific) {
        this.step++;
        this.getCourseInfos();
        this.getUserCourses(this.user_id);
        console.log(this.courseInfos)
      } else {
        this.step = 3;
      }
    }
    else if(this.step == 2) {
      this.addCourse_step = true;
      if (this.courseDetails.invalid) { return }
      this.step++;
    }
    else if(this.step == 3) {
      this.step++;
    }
  }

  previous() {
    if (this.step == 3 && !this.is_scientific) {
      this.step -= 2;
    } else {
      

      if (this.step == 1) {
        this.status_step = false;
      }
      if (this.step == 2) {
        this.addCourse_step = false;
        this.step--
      }
      if (this.step == 3) {
        
        this.step--
      }
      if (this.step == 4) {
        
        this.step--
      }
    }

  }
  submit() {
    if (this.step == 4) {

      if (this.schoolarShipForm.invalid) { return }
      this.approveApplication()
    }
  }




  reject(user_id: any) {
    const secondModal = this.modalService.open(NgbdModal4Content, { size: 'lg' });
    secondModal.componentInstance.user_id = user_id;
    secondModal.closed.subscribe(() => this.activeModal.close('true'));

  }

  sendInterviewRequest(user_id: any) {
    console.log(user_id)

    this.http.post('http://localhost:3000/app/sendInterviewRequest', { user_id }, this.httpOptions).subscribe(data => {

      if(data == true){
        this.toastr.success('Interview Request Sended Successfully', 'Success')
        this.activeModal.close();
      }
  
      });

  }

  getprogramQuotaInfos() {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/getProgramQuotaInfos', { user_id }, this.httpOptions).subscribe(data => {
      this.programQuotaInfo = data;
      console.log(data)

      console.log('Course infos')

      console.log(this.programQuotaInfo)
    });
  }

  approveApplication() {
    var user_id = this.user_id;
    var schoolar = this.schoolarShipForm.value.schoolarChoice
    this.http.post('http://localhost:3000/app/approveApplication', { user_id , schoolar }, this.httpOptions).subscribe(data => {

    if(data == true){
      this.toastr.success('Application approved Successfully', 'Success')
      this.activeModal.close();
    }

    });
  }


  getCourseInfos() {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/getCourseInfos', { user_id }, this.httpOptions).subscribe(data => {
      this.courseInfos = data;
      console.log(data)

      console.log('Course infos')

      console.log(this.courseInfos)
    });
  }

  addCourse(course_name: string, user_id: any) {
    console.log(user_id, course_name)

    this.http.post('http://localhost:3000/app/controlAdded', { user_id, course_name }, this.httpOptions).subscribe(data => {
      console.log(data)

    if(data == true){
      this.toastr.error('This course already added please choose another one', 'Error')
    }else{
      this.http.post('http://localhost:3000/app/addCourse', { user_id, course_name }, this.httpOptions).subscribe(data => {

        this.getUserCourses(this.user_id);
        console.log('Course infos')
        this.toastr.success('Course Added Successfully', 'Success')
  
      });
    }
  });


  }

  removeCourse(course_name: string, user_id: any) {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/removeCourse', { user_id, course_name }, this.httpOptions).subscribe(data => {
      this.getUserCourses(this.user_id);
      console.log(data)

      this.toastr.success('Course Removed Successfully', 'Success')
    });
  }

  getUserCourses(user_id: any) {
    var user_id = this.user_id;
    this.http.post('http://localhost:3000/app/getUserCourses', { user_id }, this.httpOptions).subscribe(data => {
    this.userCourses = data;
      console.log(data)
    });
  }


  getUniqueUserFiles(user_id: any): void {
    this.http.post('http://localhost:3000/app/getUniqueUserFiles', { user_id }, this.httpOptions).subscribe(data => {
      this.fileInfos = data;
      console.log(data)

      console.log('User File infos')

      console.log(this.fileInfos)
    });

  }
}



@Component({
  template: `
  <div class="modal-header">
  <h4 class="modal-title"> Enter a reject reason </h4>
  <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
</div>
<form [formGroup]="rejectForm" (ngSubmit)="rejectDocument()" novalidate>
<div class="modal-body">

<label>Reject Reason</label> <br>
<input id="reason" type="text" formControlName="reason" >
<div *ngIf="rejectForm.get('reason')?.errors?.required"> 
<p> *Required </p> 
</div>
</div>

<div class="modal-footer">
  <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('false')">Close</button>
  <button color="accent" class="btn btn-outline-dark" [disabled]="!rejectForm.valid" clicktype="submit">
  <span>Reject</span>
</button>

</div>
</form>
  `
})
export class NgbdModal8Content implements OnInit {
  @Input() user_id: any;
  @Input() file_name: string;
  rejectForm: FormGroup;
  constructor(public activeModal: NgbActiveModal, private homePageService: HomePageService, private toastr: ToastrService, private applicationService: ApplicationService) { }
  ngOnInit(): void {
    this.rejectForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      reason: new FormControl("", [Validators.required]),
    });
  }

  rejectDocument(): void {
    console.log('Reject Çalıştı')
    console.log('reason = ' + this.rejectForm.value.reason)
    this.applicationService
      .rejectApplication(this.user_id, this.rejectForm.value.reason)
      .subscribe(data => {
        if(data == true){
          this.activeModal.close('true')
        }
        


      },
        err => {
        });
  }
}
