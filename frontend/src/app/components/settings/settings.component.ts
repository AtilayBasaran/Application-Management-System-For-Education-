import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastrService } from 'ngx-toastr';


export interface StudentTable {
  name: string;
  position: number;
  mail: string;

}

const ELEMENT_DATA: StudentTable[] = [
  { position: 1, name: 'salihh', mail: "salih@gmail.com" },
  { position: 2, name: 'salih', mail: "salih@gmail.com" },
  { position: 3, name: 'salih', mail: "salih@gmail.com" },
  { position: 4, name: 'salih', mail: "salih@gmail.com" },
  { position: 5, name: 'salih', mail: "salih@gmail.com" },
  { position: 6, name: 'salih', mail: "salih@gmail.com" },
  { position: 7, name: 'atılay', mail: "salih@gmail.com" },
  { position: 8, name: 'salih', mail: "salih@gmail.com" },
  { position: 9, name: 'salih', mail: "salih@gmail.com" },
  { position: 10, name: 'salih', mail: "salih@gmail.com" },
  { position: 11, name: 'salih', mail: "salih@gmail.com" },
  { position: 12, name: 'salih', mail: "salih@gmail.com" },
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SettingsComponent implements AfterViewInit {
  columnsToDisplay: string[] = ['position', 'name', 'mail'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  expandedElement: StudentTable | null;

  userInfos: any;
  courseInfos: any;
  courseForm: FormGroup;
  courseNameForm: FormGroup;
  errorMessage = '';
  isAddCourseFailed = false;


  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }//buraya daha sonra database gelecek

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
    this.courseInfos = this.getCourseInfos();
    this.courseForm = this.createFormGroup();
    this.courseNameForm = this.createNameForm();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      courseName: new FormControl("", [Validators.required]),
      deptName: new FormControl("", [
        Validators.required,
      ]),
    });
  }

  createNameForm(): FormGroup {
    return new FormGroup({
      courseName: new FormControl("", [Validators.required])
    });
  }

  getUserInfos() {
    this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
      this.userInfos = data;
      console.log(data)

      console.log('user infos')

      console.log(this.userInfos)
    });
  }

  getCourseInfos() {
    this.http.get('http://localhost:3000/settings/courseDetails').subscribe(data => {
      this.courseInfos = data;
      console.log(data)

      console.log('Course Details')

      console.log(this.courseInfos)
    });
  }

  deleteUser(userid : any) {
    console.log(userid)
    this.http.get('http://localhost:3000/settings/deleteUser/'+userid).subscribe(data => {
      console.log(data)
      console.log(this.userInfos)
      this.ngOnInit()
    });
    this.toastr.success('User Deleted Successfully', 'Success')
  }

  updateInstitute(userid : any) {
    this.http.get('http://localhost:3000/settings/updateInstitute/'+userid).subscribe(data => {
      this.ngOnInit()
    this.toastr.success('User Role Updated To Institute', 'Success')
    });
  }

  updateHeadOfDept(userid : any) {
    this.http.get('http://localhost:3000/settings/updateHeadOfDept/'+userid).subscribe(data => {
      this.ngOnInit()
    this.toastr.success('User Role Updated To Head Of Dept', 'Success')
    });
  }

  addCourse(): void {
    this.settingService
      .addCourse(this.courseForm.value.courseName, this.courseForm.value.deptName)
      .subscribe(
        data => {
          console.log(data);
          this.toastr.success('Course Added Successfully', 'Success')
          this.ngOnInit()
        },
        err => {
          this.errorMessage = err.error.message;
          this.isAddCourseFailed = true;
        });
  }

  changeCourseName(courseId : any): void {
    console.log(courseId)
    console.log(this.courseNameForm.value.courseName)
    this.settingService
      .changeCourseName(courseId, this.courseNameForm.value.courseName)
      .subscribe(
        data => {
          console.log(data);
          this.toastr.success('Course Name Changed', 'Success')
          this.ngOnInit()
        },
        err => {
          this.errorMessage = err.error.message;
          this.isAddCourseFailed = true;
        });
  }


}

