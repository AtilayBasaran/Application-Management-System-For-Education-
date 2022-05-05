import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface StudentTable {
  name: string;
  position: number;
  mail: string;

}

const ELEMENT_DATA: StudentTable[] = [
  { position: 1, name: 'salihh', mail: "salih@gmail.com" },
  { position: 2, name: 'salih', mail: "salih@gmail.com" },
  { position: 3, name: 'salih', mail: "salih@gmail.com" },
  { position: 4, name: 'salih', mail: "salih@gmail.com" },
  { position: 5, name: 'salih', mail: "salih@gmail.com" },
  { position: 6, name: 'salih', mail: "salih@gmail.com" },
  { position: 7, name: 'atılay', mail: "salih@gmail.com" },
  { position: 8, name: 'salih', mail: "salih@gmail.com" },
  { position: 9, name: 'salih', mail: "salih@gmail.com" },
  { position: 10, name: 'salih', mail: "salih@gmail.com" },
  { position: 11, name: 'salih', mail: "salih@gmail.com" },
  { position: 12, name: 'salih', mail: "salih@gmail.com" },
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SettingsComponent implements AfterViewInit {
  columnsToDisplay: string[] = ['position', 'name', 'mail'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  expandedElement: StudentTable | null;

  currentUser: any;
  courseForm: FormGroup;
  errorMessage = '' ; 
  isAddCourseFailed = false;


  constructor(private token: TokenStorageService , private settingService: SettingService , private _liveAnnouncer: LiveAnnouncer , private router: Router) { }//buraya daha sonra database gelecek

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

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.courseForm = this.createFormGroup();
    console.log(this.currentUser)
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      courseName: new FormControl("", [Validators.required]),
      deptName: new FormControl("", [
        Validators.required,
      ]),
    });
  }

  addCourse(): void {
    const email = this.currentUser.email;
    console.log(this.courseForm.value.courseName);
    console.log(email)
    this.settingService
      .addCourse(this.courseForm.value.courseName, this.courseForm.value.deptName)
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['successRegister'])
          .then(() => {
          window.location.reload();
        });
        },
        err => {
          this.errorMessage = err.error.message;
          this.isAddCourseFailed = true;
        });
  }

}

