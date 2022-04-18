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

export interface StudentTable2 {
  name: string;
  position: number;
  mail: string;
  department: string;
  description: string;

}
const ELEMENT_DATA: StudentTable[] = [
  {position: 1, name: 'salihh', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 2, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 3, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 4, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 5, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 6, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 7, name: 'atılay', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 8, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 9, name: 'salih', mail: "salih@gmail.com", department: 'EE',description:'deneme'},
  {position: 10, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 11, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 12, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
];

const ELEMENT_DATA2: StudentTable2[] = [
  {position: 1, name: 'atılay', mail: "atılay@gmail.com", department: 'CS',description:'deneme'},
  {position: 2, name: 'atılay', mail: "atılay@gmail.com", department: 'CS',description:'deneme'},
  {position: 3, name: 'atılay', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 4, name: 'atılay', mail: "atılay@gmail.com", department: 'CS',description:'deneme'},
  {position: 5, name: 'salih', mail: "salih@gmail.com", department: 'CS',description:'deneme'},
  {position: 6, name: 'salih', mail: "atılay@gmail.com", department: 'EE',description:'deneme'},
  {position: 7, name: 'atılay', mail: "salih@gmail.com", department: 'AB',description:'deneme'},
  {position: 8, name: 'salih', mail: "atılay@gmail.com", department: 'CS',description:'deneme'},
];

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
export class HomePageComponent implements AfterViewInit  {
  columnsToDisplay : string[] = ['position', 'name', 'mail', 'department'];
  columnsToDisplay2 : string[] = ['position', 'name', 'mail', 'department'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  expandedElement: StudentTable | null;
  expandedElement2: StudentTable2 | null;
  

  constructor(private _liveAnnouncer: LiveAnnouncer) {}//buraya daha sonra database gelecek

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

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

  announceSortChange2(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
