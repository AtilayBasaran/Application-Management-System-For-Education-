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
  settingUserInfo: any;
  courseInfos: any;
  schoolarInfos: any;
  
  quotaCourseInfos : any;
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
  quotaYearChooice : any;
  quotaSemesterChooice : any;
  programQuotaInfos : any;
  yearInfo : any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
    this.settingUserInfo = this.getSettingUserInfo();
    this.quotaInfos = this.getQuotaInfos();
    this.programInfos = this.getProgram();
    this.courseInfos = this.getCourseInfos();
    this.courseForm = this.createFormGroup();
    this.yearInfo = this.getYearInfo();
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
      quotaYearChooice: new FormControl("", [Validators.required]),
      quotaSemesterChooice: new FormControl("", [Validators.required]),
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
      console.log(this.userInfos)
    });
  }

  getSettingUserInfo() {
    this.http.get('http://localhost:3000/settings/settingsUserDetails').subscribe(data => {
      this.settingUserInfo = data;
      console.log(data)
      console.log(this.settingUserInfo)
    });
  }

  getQuotaInfos() {
    this.http.get('http://localhost:3000/settings/getAllQuota').subscribe(data => {
      this.quotaInfos = data;
      console.log(data)
      console.log(this.quotaInfos)
    });
  }

  getProgram() {
    this.http.get('http://localhost:3000/programs/getAllProgram').subscribe(data => {
      this.programInfos = data;
      console.log(data)
      console.log(this.programInfos)
    })
  }

  getYearInfo() {
    this.http.get('http://localhost:3000/programs/getYearInfo').subscribe(data => {
      this.yearInfo = data;
      console.log(data)
      console.log(this.yearInfo)
    })
  }

  getProgramQuotaInfos(year : any , semester : any) {
    this.http.post('http://localhost:3000/programs/getProgramQuotaInfos',{year, semester} ,this.httpOptions).subscribe(data => {
      this.programQuotaInfos = data;
      console.log(data)
      console.log(this.programQuotaInfos)
    })
  }

  getSchoolarInfos() {
    var academic_year = this.quotaYearChooice
    var semester = this.quotaSemesterChooice
    var program = this.programChooice  
    this.http.post('http://localhost:3000/settings/getSchoolarInfos',{academic_year, semester, program} ,this.httpOptions).subscribe(data => {
      this.schoolarInfos = data;
      console.log(data)
      console.log(this.schoolarInfos)
    })
  }

  setProgram(program_name : string) {
    this.programChooice = program_name ; 
    this.getSchoolarInfos()

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
        console.log(this.quotaDetail)
      });
      console.log(this.initial_quota)
    }
  }

  getCourseInfos() {
    this.http.get('http://localhost:3000/settings/courseDetails').subscribe(data => {
      this.courseInfos = data;
      console.log(data)
      console.log(this.courseInfos)
    });
  }

  getQuotaProgramInfos() {
    var academic_year = this.quotaYearChooice
    var semester = this.quotaSemesterChooice
    this.http.post('http://localhost:3000/programs/getQuotaProgramInfos', {academic_year,semester},this.httpOptions).subscribe(data => {
      this.quotaCourseInfos = data;
      console.log(data)
      console.log(this.quotaCourseInfos)
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
          var errorMes = err.error.message;
          this.errorMessage = err.error.message;
          this.toastr.error(errorMes, 'Error')
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
    if(Number(this.quotaForm.value.quotaNumber) <= 0){
      this.toastr.error('Quota cannot be smaller or equal than 0', 'Error')
      return;
    }
    var quotaProgramChooice  = this.quotaForm.value.quotaProgramChooice;
    var quotaSchoolarChoice  = this.quotaForm.value.quotaSchoolarChoice;
    var quotaSemesterChooice = this.quotaForm.value.quotaSemesterChooice;
    var quotaYearChooice = this.quotaForm.value.quotaYearChooice;
    var quotaNumber = this.quotaForm.value.quotaNumber;

    console.log(quotaProgramChooice)
    console.log(quotaSchoolarChoice)
    console.log(quotaSemesterChooice)
    console.log(quotaYearChooice)
    console.log(quotaNumber)
    
    
    this.http.post('http://localhost:3000/settings/changeQuota',{quotaProgramChooice, quotaSchoolarChoice, quotaSemesterChooice,quotaYearChooice, quotaNumber}).subscribe(data => {
      console.log(data)
      this.toastr.success('Quota changed successfully', 'Success')
    });
  }


}

