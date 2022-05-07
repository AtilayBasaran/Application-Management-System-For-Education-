import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  currentUser: any;
  private url = "http://localhost:3000/settings";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private router: Router) { }

  addCourse(courseName: String, deptName : String): Observable<any> {
    console.log(courseName + ' ' + deptName)
    return this.http
      .post(`${this.url}/addCourse`,{courseName,deptName}, this.httpOptions);
  }

  changeCourseName(courseId: String, courseName : String): Observable<any> {
    console.log('Change Password Servisinin içi ')
    console.log(courseId + ' ' + courseName)
    return this.http
      .post(`${this.url}/changeCourseName`,{courseId,courseName}, this.httpOptions);
  }

}
