import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastrService } from 'ngx-toastr';

interface Car {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomePageComponent implements AfterViewInit, OnInit  {
  columnsToDisplay : string[] = ['id','firstname','lastname','email','role'];
  userInfos: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
    this.dataSource = new MatTableDataSource<Car>(this.userInfos);
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("ekin")
    console.log(this.dataSource);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getUserInfos() {
    this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
      this.userInfos = data;
      console.log(data)

      console.log('user infos')

      console.log(this.userInfos)
    });
  }
}
