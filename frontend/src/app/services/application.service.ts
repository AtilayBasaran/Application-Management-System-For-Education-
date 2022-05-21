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

  addPersonalInfo(personalInfo: Omit<personalDetails, "email">) : Observable<personalDetails>{
    var user_id = this.token.getUser().id;
    console.log('buradaki id', user_id)
    return this.http
      .post<personalDetails>(`${this.url}/addPersonal`, {personalInfo,user_id}, this.httpOptions);
  }

  addEducationalInfo(eduInfo: Omit<educationalDetails, "university">) : Observable<educationalDetails>{
    var user_id = this.token.getUser().id;
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

}
