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

}
