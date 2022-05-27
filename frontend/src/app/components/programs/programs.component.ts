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
  programType = 'All'
  displayedColumns : string[] = ['id','Program','Faculty','Degree','Language','Duration', 'Campus'];
  programInfos: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild('MatPaginator1', {static: true}) paginator: MatPaginator; 
  @ViewChild('matsort1', {static: true}) sort: MatSort;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private token: TokenStorageService, private settingService: SettingService, private _liveAnnouncer: LiveAnnouncer, private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getProgramInfos('All');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getProgramInfos(prType : string): void {
    if (prType == 'All'){
      console.log('All çalıştı')
      this.http.get('http://localhost:3000/programs/getAllProgram').subscribe(data => {
        this.programInfos = data;
        this.dataSource = new MatTableDataSource(this.programInfos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data)
  
        console.log('Program infos')
  
        console.log(this.programInfos)
      });

    }else if(prType == 'Phd'){
      const type = 'Phd';
      console.log('Phd çalıştı')
      this.http
      .post('http://localhost:3000/programs/getProgramInfo',{type}, this.httpOptions).subscribe(data => {
        this.programInfos = data;
        this.dataSource = new MatTableDataSource(this.programInfos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data)
  
        console.log('Program infos')
  
        console.log(this.programInfos)
      });

    }else if(prType == 'Bachelor'){
      const type = 'Bachelor';
      console.log('Bachelor çalıştı')
      this.http
      .post('http://localhost:3000/programs/getProgramInfo',{type}, this.httpOptions).subscribe(data => {
        this.programInfos = data;
        this.dataSource = new MatTableDataSource(this.programInfos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data)
  
        console.log('Program infos')
  
        console.log(this.programInfos)
      });

    }else if(prType == 'Master'){
      const type = 'Master';
      console.log('Master çalıştı')
      this.http
      .post('http://localhost:3000/programs/getProgramInfo',{type}, this.httpOptions).subscribe(data => {
        this.programInfos = data;
        this.dataSource = new MatTableDataSource(this.programInfos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data)
  
        console.log('Program infos')
  
        console.log(this.programInfos)
      });

    }
  }

}
