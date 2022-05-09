import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from 'src/app/services/upload-file.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ApplicationService } from "src/app/services/application.service";
import { TokenStorageService } from '../../services/token-storage.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {

  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  upload_step = false;
  education_step = false;
  step = 1;
  isErrorOccured = false;
  errorMessage = '';
  currentUser: any;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  constructor(private formBuilder: FormBuilder, private applicationService: ApplicationService, private router: Router, private token: TokenStorageService, private uploadService: UploadFilesService, private toastr: ToastrService) { }

  ngOnInit() {
    
    this.fileInfos = this.uploadService.getFiles();
    this.currentUser = this.token.getUser();

    this.personalDetails = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      school: ['', Validators.required]
    });

    this.addressDetails = this.formBuilder.group({
      city: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required]
    });

    this.educationalDetails = this.formBuilder.group({
      highest_qualification: ['', Validators.required],
      university: ['', Validators.required],
      total_marks: ['', Validators.required]
    });
  }

  get personal() { return this.personalDetails.controls; }

  get address() { return this.addressDetails.controls; }

  get education() { return this.educationalDetails.controls; }

  next() {

    if (this.step == 1) {
      this.personal_step = true;
      if (this.personalDetails.invalid) { return }
      this.step++
    }

    else if (this.step == 2) {
      this.address_step = true;
      if (this.addressDetails.invalid) { return }
      this.step++;
    }
    else if (this.step == 3) {
      this.upload_step = true;
      if (this.addressDetails.invalid) { return }
      this.step++;
    }


  }

  previous() {
    this.step--

    if (this.step == 1) {
      this.address_step = false;
    }
    if (this.step == 2) {
      this.upload_step = false;
    }
    if (this.step == 3) {
      this.education_step = false;
    }

  }

  submit() {
    if (this.step == 4) {
      this.education_step = true;
      if (this.educationalDetails.invalid) { return }
      else {

        const email = this.currentUser.email;
        console.log(email);
        this.applicationService
          .createMainApp(email)
          .subscribe(
            data => {
            console.log(data);
            this.isErrorOccured = false;
          },
          err => {
            this.errorMessage = err.error.message;
            this.isErrorOccured = true;
          })

        this.applicationService
          .addPersonalInfo(this.personalDetails.value)
          .subscribe(
            data => {
            console.log(data);
            this.isErrorOccured = false;
          },
          err => {
            this.errorMessage = err.error.message;
            this.isErrorOccured = true;
          })

        this.applicationService
          .addEducationalInfo(this.educationalDetails.value)
          .subscribe(data => {
            console.log(data);
            this.isErrorOccured = false;
          },
          err => {
            this.errorMessage = err.error.message;
            this.isErrorOccured = true;
          })

        this.applicationService
          .addAddressInfo(this.addressDetails.value)
          .subscribe(data => {
            console.log(data);
            this.isErrorOccured = false;
          },
          err => {
            this.errorMessage = err.error.message;
            this.isErrorOccured = true;
          })
      };

    }
    if(this.isErrorOccured){
      alert('Error Occured Please Control your information : ERROR Message = ' + this.errorMessage)
    }else{
      alert('Application operation finished succesfully')
      this.router.navigate(["successApp"]);
    }
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

          this.fileInfos = this.uploadService.getFiles();

          console.log(data);

        },
        err => {
          this.errorMessage = err.error.message;
        }

      );
  }

}

