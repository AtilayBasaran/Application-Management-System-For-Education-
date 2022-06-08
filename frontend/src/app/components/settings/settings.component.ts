import { Component, OnInit } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  searchText: any;
  programInfos: any;
  quotaInfos: any;
  userInfos: any;
  courseInfos: any;
  courseForm: FormGroup;
  courseNameForm: FormGroup;
  errorMessage = '';
  chooseSchoolar: string;
  isAddCourseFailed = false;
  schoolarShipForm !: FormGroup;
  quotaForm !: FormGroup;
  programChooice: string;
  scholarChooice: any;
  quotaDetail : any;
  initial_quota : any ;
  remaining_quota : any;
  quotaProgramChooice : String;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
    this.quotaInfos = this.getQuotaInfos();
    this.programInfos = this.getProgram();
    this.courseInfos = this.getCourseInfos();
    this.courseForm = this.createFormGroup();
    this.courseNameForm = this.createNameForm();
    this.quotaForm = this.createQuotaGroup();

    this.schoolarShipForm = this.formBuilder.group({
      schoolarChoice: [null, Validators.required]
    })
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      courseName: new FormControl("", [Validators.required]),
      deptName: new FormControl("", [
        Validators.required,
      ]),
    });
  }

  createQuotaGroup(): FormGroup {
    return new FormGroup({
      quotaProgramChooice: new FormControl("", [Validators.required]),
      quotaSchoolarChoice: new FormControl("", [Validators.required,]),
      quotaNumber: new FormControl("", [ Validators.required,]),
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

  getQuotaInfos() {
    this.http.get('http://localhost:3000/settings/getAllQuota').subscribe(data => {
      this.quotaInfos = data;
      console.log(data)

      console.log('quota infos')

      console.log(this.quotaInfos)
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

  setProgram(program_name : string) {
    this.programChooice = program_name ; 

    console.log(this.programChooice)
  }

  setScholar(scholar : any) {
    this.scholarChooice = scholar ; 

    console.log(this.scholarChooice)

    if(this.programChooice != null && this.scholarChooice != null){
      var program = this.programChooice
      var scholar = this.scholarChooice

      this.http.post('http://localhost:3000/settings/getQuotaDetail', {program,scholar}).subscribe(data => {
        var a = data;
        let myString = JSON.stringify(data)
        var jsonObj = JSON.parse(myString)
        var quota_data = jsonObj[0]
        this.initial_quota = quota_data.initial_quota
        this.remaining_quota = quota_data.remaining_quota

        console.log('Quota Details')
  
        console.log(this.quotaDetail)
      });
      console.log(this.initial_quota)
    }

    

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

  changeQuota(): void {
    console.log(this.remaining_quota + this.quotaForm.value.quotaNumber)
    if(Number(this.remaining_quota) + Number(this.quotaForm.value.quotaNumber) < 0){
      this.toastr.error('Quota cannot be smaller than 0', 'Error')
      return;
    }
    var initial_quota = this.initial_quota;
    var remaining_quota = this.remaining_quota;
    var quotaNumber  = this.quotaForm.value.quotaNumber;
    var quotaProgramChooice  = this.quotaForm.value.quotaProgramChooice;
    var quotaSchoolarChoice  = this.quotaForm.value.quotaSchoolarChoice;
    var scholarChooice = this.scholarChooice;
    this.http.post('http://localhost:3000/settings/changeQuota',{quotaNumber, quotaProgramChooice, quotaSchoolarChoice, initial_quota, remaining_quota}).subscribe(data => {
      console.log(data)
      this.toastr.success('Quota changed successfully', 'Success')
    });
  }


}

