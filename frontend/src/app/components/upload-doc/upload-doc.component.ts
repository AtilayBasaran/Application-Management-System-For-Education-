import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from 'src/app/services/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TokenStorageService } from '../../services/token-storage.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
              this.toastr.success('File Uploaded Successfully', 'Success')
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          });
      }
      this.selectedFiles = undefined;
    }
  }

  deleteFile(document_url: any): void {

    this.uploadService
      .deleteFiles(document_url)
      .subscribe(
        data => {

          this.toastr.success('File Deleted Successfully', 'Success')

          this.ngOnInit();

          console.log(data);

        },
        err => {
          this.errorMessage = err.error.message;
        }

      );
  }

}
