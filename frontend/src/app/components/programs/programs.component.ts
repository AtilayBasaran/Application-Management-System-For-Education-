import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Data, Router, RouterModule } from '@angular/router';
import { User } from 'src/app/models/User';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})

export class ProgramsComponent implements OnInit {
  displayedColumns : string[] = ['id','firstname','lastname','email','role'];
  userInfos: any;

  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {
    this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
      this.userInfos = data;
      console.log(data)

      console.log('user infos')

      console.log(this.userInfos)
    });
  }

  ngOnInit(): void {
  }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.userInfos.filter = filterValue;
  // }

}
