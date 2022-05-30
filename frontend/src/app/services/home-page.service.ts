import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  applicationInfos : any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  

  constructor(private router: Router, private token: TokenStorageService, private http: HttpClient) { }


  getProgramInfos(degree : string) {
    this.http.get('http://localhost:3000/home/getApplicationInfo', this.httpOptions).subscribe(data => {
      this.applicationInfos = data;
      console.log(data)

      console.log('Application infos')

      console.log(this.applicationInfos)
    });
  }

  acceptDocument(user_id : any, file_name : string) {
    return this.http.post('http://localhost:3000/home/acceptDocument',{user_id, file_name} ,this.httpOptions);
  }

  rejectDocument(user_id : any, file_name : string , reject_reason : string) {
    return this.http.post('http://localhost:3000/home/rejectDocument',{user_id, file_name, reject_reason} ,this.httpOptions);
  }

  controlAllControlled(user_id : any) {
    return this.http.post('http://localhost:3000/home/controlAllControlled',{user_id}, this.httpOptions);
  }

  changeStatus(user_id : any) {
    console.log('Change status servis içinden tetiklendi')
    return this.http.post('http://localhost:3000/home/changeStatus',{user_id}, this.httpOptions);
  }

}
