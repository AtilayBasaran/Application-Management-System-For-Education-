import { Component, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { HomePageService } from 'src/app/services/home-page.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-hod-application',
  templateUrl: './hod-application.component.html',
  styleUrls: ['./hod-application.component.scss']
})
export class HodApplicationComponent implements OnInit {
  columnsToDisplay: string[] = ['name', 'register_date', 'program', 'email', 'agency_mail', 'stage', 'actions'];
  userInfos: any;
  applicationInfos: any;
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

  openDialog(): void {
    const modalRef = this.modalService.open(DenemeComponent);
  }

  ngOnInit(): void {
    this.applicationInfos = this.getApplicationInfos();
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

  open(user_id: any) {

    const firstModal = this.modalService.open(NgbdModal3Content,{ size: 'xl' } );
    firstModal.componentInstance.user_id = user_id;

  }

  
  getApplicationInfos() {
    this.http.get('http://localhost:3000/home/getApplicationInfo').subscribe(data => {
      this.applicationInfos = data;
      this.dataSource = new MatTableDataSource(this.applicationInfos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource2 = new MatTableDataSource(this.applicationInfos);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
      console.log(data)

      console.log('Application infos')

    });
  }

}
@Component({
  selector: 'app-deneme',
  templateUrl: '../deneme/deneme.component.html',
})
export class DenemeComponent {
  constructor(public activeModal: NgbActiveModal) {
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
  showMe:boolean=false;

  
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  personal_step = false;
  address_step = false;
  upload_step = false;
  education_step = false;
  degree_step = false;
  step = 1;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private uploadService: UploadFilesService, private http: HttpClient) { }

  ngOnInit(): void {

    this.getUniqueUserFiles(this.user_id);


    console.log(this.fileInfos)
  }

  hiddenScientific() {
    this.showMe =! this.showMe;
  }

  next() {

    if (this.step == 1) {
      this.degree_step = true;
      this.step++;
    }

    else if (this.step == 2) {
      this.personal_step = true;
      this.step++
    }
    else if (this.step == 3) {
      this.education_step = true;
      this.step++;
    }


  }

  previous() {
    this.step--

    if (this.step == 1) {
      this.degree_step = false;
    }
    if (this.step == 2) {
      this.personal_step = false;
    }
    if (this.step == 3) {
      this.education_step = false;
    }

  }
  submit() {
    if (this.step == 4) {
    }
  }


  open(user_id : any) {
    this.modalService.open(NgbdModal4Content, { size: 'lg' });

  }

  getUniqueUserFiles(user_id : any) :void {
    this.http.post('http://localhost:3000/app/getUniqueUserFiles', {user_id}, this.httpOptions).subscribe(data => {
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
  <button color="accent" class="btn btn-outline-dark" [disabled]="!rejectForm.valid" type="submit">
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
  constructor(public activeModal: NgbActiveModal, private homePageService: HomePageService, private toastr: ToastrService) { }
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
    console.log('reason = '+ this.rejectForm.value.reason)
    this.homePageService
      .rejectDocument(this.user_id, this.file_name, this.rejectForm.value.reason)
      .subscribe(data => {
        console.log(data);
        this.activeModal.close('true')
        
        
      },
      err => {
      });
  }
}
