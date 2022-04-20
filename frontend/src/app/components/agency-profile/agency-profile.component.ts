import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface StudentTable {
  StudentName: string;
  number: number;
  mail: string;
  department: string;
  appDate: String;
  appStatus: String;
  description: string;
  
}

const ELEMENT_DATA: StudentTable[] = [
  {number: 1, StudentName: 'salihh', mail: "salih@gmail.com", department: 'CS',appDate: "07.03.2022",appStatus:"Waiting",description:'deneme'},
  {number: 2, StudentName: 'salih', mail: "salih@gmail.com", department: 'EE',appDate: "07.03.2022",appStatus:"Waiting",description:'deneme'},
  {number: 3, StudentName: 'atılay', mail: "atilay@gmail.com", department: 'CS',appDate: "07.03.2022",appStatus:"Rejected",description:'deneme'},
];
@Component({
  selector: 'app-agency-profile',
  templateUrl: './agency-profile.component.html',
  styleUrls: ['./agency-profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AgencyProfileComponent implements AfterViewInit {
  columnsToDisplay : string[] = ['number', 'StudentName', 'mail', 'department','appDate','appStatus'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  expandedElement: StudentTable | null;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}//buraya daha sonra database gelecek

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
