import { Component, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
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
import { User } from 'src/app/models/User';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, subscribeOn } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  columnsToDisplay: string[] = ['name', 'register_date', 'program', 'email', 'agency_mail', 'stage', 'actions'];
  userInfos: any;
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

  open(user_id: any) {

    const firstModal = this.modalService.open(NgbdModal1Content,{ size: 'xl' });
    firstModal.componentInstance.user_id = user_id;
    firstModal.closed.subscribe(() => this.ngOnInit());

  }

  getTurkishApplicationInfos() {
    this.http.get('http://localhost:3000/home/getTurkishApplicationInfo').subscribe(data => {
      this.turkishApplicationInfos = data;
      this.dataSource = new MatTableDataSource(this.turkishApplicationInfos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;


      

      console.log('Application infos')

    });
  }

getInternationalApplicationInfos() {
    this.http.get('http://localhost:3000/home/getInternationalApplicationInfo').subscribe(data => {
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
  templateUrl: './content-1.html',
})
export class NgbdModal1Content implements OnInit {
  @Input() user_id: any;
  fileInfos: any;
  secondModal : NgbModalRef;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private uploadService: UploadFilesService, private http: HttpClient, private homePageService: HomePageService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.getUniqueUserFiles(this.user_id);
    this.controlAllControlled();


    console.log(this.fileInfos)
  }

  controlAllControlled(): void {
    this.homePageService
      .controlAllControlled(this.user_id)
      .subscribe(data => {
        console.log('Controll all tarafından dönen response '+ data)
        if(data == true){
          console.log('cahngestatus girdi')
          this.homePageService
          .changeStatus(this.user_id)
            .subscribe(data => {
              console.log(data)
              },
              err => {
                console.log(err)
              });
        }
      },
      err => {
      });
  }


  open(user_id: any, file_name: string) {
    this.secondModal = this.modalService.open(NgbdModal2Content, { size: 'lg' });
    this.secondModal.componentInstance.user_id = user_id;
    this.secondModal.componentInstance.file_name = file_name;
    this.secondModal.result.then((result) => {
      console.log('buraya kadar geliyor mu ? ')
      console.log(result)
      if (result) {
        if(result == 'true'){
          this.toastr.success('Document rejected successfully', 'Success')
          this.ngOnInit();
        }else if(result == 'false'){
          this.toastr.error('Document rejection cancelled please upload new document', 'Error')
        }
      }
      });

  }

  acceptDocument(user_id: any, file_name: string) {
    this.homePageService
      .acceptDocument(user_id, file_name)
      .subscribe(data => {
        console.log(data);

        if (data == true) {
          this.toastr.success('Document Approved Successfully', 'Success')
          this.ngOnInit();
        } else {
          this.toastr.error('Document Approved process can not completed', 'Error')
        }
      },
        err => {
          console.log(err)
        })

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
      <button color="accent" class="btn btn-outline-dark" [disabled]="!rejectForm.valid" type="submit">
      <span>Reject</span>
    </button>
  
    </div>
    </form>
  `
})
export class NgbdModal2Content implements OnInit{
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