import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { personalDetails } from '../models/PersonalDetails';
import { educationalDetails } from '../models/EducationalDetails';
import { addressDetails } from '../models/AddressDetails';
import { degreeDetails } from '../models/DegreeDetails';
import { TokenStorageService } from './token-storage.service';



@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private url = "http://localhost:3000/app";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private router: Router, private token: TokenStorageService
  ) {}

  addPersonalInfo(user_id : any , personalInfo: Omit<personalDetails, "email">) : Observable<personalDetails>{
    return this.http
      .post<personalDetails>(`${this.url}/addPersonal`, {personalInfo,user_id}, this.httpOptions);
  }

  addEducationalInfo(user_id : any, eduInfo: Omit<educationalDetails, "university">) : Observable<educationalDetails>{
    return this.http
      .post<educationalDetails>(`${this.url}/addEducational`, {eduInfo,user_id}, this.httpOptions);
  }
  createMainApp(user_id : any, degreeType : String, programType : String) : Observable<any>{
    return this.http
      .post(`${this.url}/createMainApp`, {user_id, degreeType,programType}, this.httpOptions);
  }

  controlDocumentTitle(title : String, user_id : any) : Observable<any>{
    return this.http
      .post(`${this.url}/controlTitle`, {title, user_id}, this.httpOptions);
  }

  controlDocumentName(fileName : any, user_id : any) : Observable<any>{
    return this.http
      .post(`${this.url}/controlName`, {fileName, user_id}, this.httpOptions);
  }

  rejectApplication(user_id : any, reject_reason : any) : Observable<any>{
    return this.http
      .post(`${this.url}/rejectApplication`, {user_id, reject_reason}, this.httpOptions);
  }

}
