import { Component, OnInit } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  programInfos: any;
  userInfos: any;
  courseInfos: any;
  courseForm: FormGroup;
  courseNameForm: FormGroup;
  errorMessage = '';
  isAddCourseFailed = false;


  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
    this.programInfos = this.getProgram();
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

  getProgram() {
    this.http.get('http://localhost:3000/programs/getAllProgram').subscribe(data => {
      this.programInfos = data;
      console.log(data)

      console.log('program infos')

      console.log(this.programInfos)
    })
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

  deleteCourse(course_id : any) {
    console.log(course_id)
    this.http.get('http://localhost:3000/settings/deletecourse/'+course_id).subscribe(data => {
      console.log(data)
      console.log(this.userInfos)
      this.ngOnInit()
    });
    this.toastr.success('Course Deleted Successfully', 'Success')
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

