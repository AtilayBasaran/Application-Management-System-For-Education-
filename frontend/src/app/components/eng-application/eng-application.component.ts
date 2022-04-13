import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface StudentTable {
  name: string;
  position: number;
  mail: string;
  department: string;
  description: string;
  
}
const ELEMENT_DATA: StudentTable[] = [
  {position: 1, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 2, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 3, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 4, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 5, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 6, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 7, name: 'atılay', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 8, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 9, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 10, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 11, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 12, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
];

@Component({
  selector: 'app-eng-application',
  templateUrl: './eng-application.component.html',
  styleUrls: ['./eng-application.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EngApplicationComponent implements AfterViewInit  {
  columnsToDisplay : string[] = ['position', 'name', 'mail', 'department'];
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
