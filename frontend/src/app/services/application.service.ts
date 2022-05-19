import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { personalDetails } from '../models/PersonalDetails';
import { educationalDetails } from '../models/EducationalDetails';
import { addressDetails } from '../models/AddressDetails';
import { degreeDetails } from '../models/DegreeDetails';



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
    private router: Router
  ) {}

  addPersonalInfo(personalInfo: Omit<personalDetails, "email">) : Observable<personalDetails>{
    return this.http
      .post<personalDetails>(`${this.url}/addPersonal`, personalInfo, this.httpOptions);
  }

  addEducationalInfo(eduInfo: Omit<educationalDetails, "university">) : Observable<educationalDetails>{
    return this.http
      .post<educationalDetails>(`${this.url}/addEducational`, eduInfo, this.httpOptions);
  }
  addAddressInfo(addressInfo: Omit<addressDetails, "city">) : Observable<addressDetails>{
    return this.http
      .post<addressDetails>(`${this.url}/addAddress`, addressInfo, this.httpOptions);
  }

  addDegreeInfo(degreeInfo: Omit<degreeDetails, "degreeName">) : Observable<degreeDetails>{
    return this.http
      .post<degreeDetails>(`${this.url}/addDegree`, degreeInfo, this.httpOptions);
  }

  createMainApp(email : String) : Observable<any>{
    return this.http
      .post(`${this.url}/createMainApp`, {email}, this.httpOptions);
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
