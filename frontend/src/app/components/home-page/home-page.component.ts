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
import { Observable, subscribeOn } from "rxjs";
import { ToastrService } from 'ngx-toastr';


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
export class HomePageComponent implements OnInit  {
  columnsToDisplay : string[] = ['id','firstname','lastname','email','role'];
  userInfos: any;
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;

  @ViewChild('MatPaginator1', {static: true}) paginator: MatPaginator; 
  @ViewChild('MatPaginator2', {static: true}) paginator2: MatPaginator;
  @ViewChild('matsort1', {static: true}) sort: MatSort;
  @ViewChild('matsort2', {static: true}) sort2: MatSort;

  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.userInfos = this.getUserInfos();
  }
  

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // applyFilter(filterValue: string){
  //   this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
  //   this.userInfos = data;
  //   this.dataSource = new MatTableDataSource(this.userInfos);
  //   this.dataSource2 = new MatTableDataSource(this.userInfos);
  //   this.dataSource.filter= filterValue.trim().toLocaleLowerCase();
  //   this.dataSource2.filter = filterValue.trim().toLocaleLowerCase();
  //     });
  //   }


  getUserInfos() {
    this.http.get('http://localhost:3000/settings/userDetails').subscribe(data => {
      this.userInfos = data;
      this.dataSource = new MatTableDataSource(this.userInfos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource2 = new MatTableDataSource(this.userInfos);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
      console.log(data)

      console.log('user infos')

      console.log(this.userInfos)
    });
  }
}
