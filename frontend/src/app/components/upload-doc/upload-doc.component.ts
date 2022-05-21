/*import { Component, OnInit , ViewChild} from '@angular/core';
import { UploadFilesService } from 'src/app/services/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TokenStorageService } from '../../services/token-storage.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.scss']
})
export class UploadFilesComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  errorMessage = '';
  fileInfos?: Observable<any>;
  currentUser: any;

  constructor(private token: TokenStorageService, private uploadService: UploadFilesService, private toastr: ToastrService) { }

  

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
    this.currentUser = this.token.getUser();
  }
}
export class ExpansionExpandCollapseAllExample {
  @ViewChild(MatAccordion) accordion: MatAccordion;
}
*/