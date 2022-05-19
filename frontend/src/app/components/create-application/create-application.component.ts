import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from 'src/app/services/upload-file.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApplicationService } from "src/app/services/application.service";
import { TokenStorageService } from '../../services/token-storage.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {
  panelOpenState = false;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  
  programInfos : any;


  selectedValue: string;

  foods: any;



  favoriteSeason: string;
  documentTitle: string;
  programs : any;
  seasons: string[] = ['T.C', 'International'];
  degreeType: string;
  dualCitizen: string;
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  degreeDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  upload_step = false;
  education_step = false;
  degree_step = false;
  step = 1;
  isErrorOccured = false;
  errorMessage = '';
  currentUser: any;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  isTurkishStudent : any;
  app_degree : string;
  isMakeChoice = false;
  isBachelor = false;
  isPhd = false;
  isMaster = false;
  isBlueCard: string;


  

  constructor(private modalService: NgbModal,private formBuilder: FormBuilder, private applicationService: ApplicationService, private router: Router, private token: TokenStorageService, private uploadService: UploadFilesService, private toastr: ToastrService, private http: HttpClient) { }

  ngOnInit() {
    console.log(this.isMakeChoice);
    
    this.fileInfos = this.uploadService.getFiles();
    this.currentUser = this.token.getUser();

    this.personalDetails = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      adress: ['', Validators.required],
      id: ['', Validators.required],
      country: ['', Validators.required] 
    });

    this.addressDetails = this.formBuilder.group({
      city: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required]
    });

    this.educationalDetails = this.formBuilder.group({
      highest_qualification: ['', Validators.required],
      university: ['', Validators.required],
      total_marks: ['', Validators.required],
      language_profiency: ['', Validators.required],
      grad_year: ['', Validators.required]
      //exam_score: ['', Validators.required] language_profiency yoksa bunun required olmasına gerek yok diye düşündüm
    });

    this.degreeDetails = this.formBuilder.group({
      degreeName: ['', Validators.required]
    })

    if(!this.isBachelor && !this.isMaster && !this.isPhd){
      this.isMakeChoice = false;
    }
  }

  get personal() { return this.personalDetails.controls; }

  get address() { return this.addressDetails.controls; }

  get education() { return this.educationalDetails.controls; }

  get degree() { return this.degreeDetails.controls; }

  next() {

    if (this.step == 1) {
      this.degree_step = true;
      this.getProgramInfos(this.degreeType);
      console.log(this.programs);
      //if (this.degreeDetails.invalid) { return }
      this.step++;
    }

    else if (this.step == 2) {
      this.personal_step = true;
      if (this.personalDetails.invalid) { return }
      this.step++
    }
    else if (this.step == 3) {
      this.education_step = true;
      if (this.educationalDetails.invalid) { return }
      this.step++;
    }
    else if (this.step == 4) {
      this.upload_step = true;
      //if (this.addressDetails.invalid) { return }
      this.step++;
    }


  }

  previous() {
    this.step--

    if (this.step == 1) {
      this.degree_step = false;
    }
    if (this.step == 2) {
      this.personal_step = false;
    }
    if (this.step == 3) {
      this.education_step = false;
    }
    if (this.step == 4) {
      this.upload_step = false;
    }

  }

  submit() {
    if (this.step == 5) {
      this.address_step = true;
      if (this.addressDetails.invalid) { return }
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
          .addDegreeInfo(this.degreeDetails.value)
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

  nationality(favoriteSeason : any): void {
    if(favoriteSeason == 'T.C'){
      this.isTurkishStudent = true;
    }else if(favoriteSeason == 'International'){
      this.isTurkishStudent = false;
    }
  }

  degreeChoose(degree : any): void {
    this.app_degree = degree;
    console.log(degree)
    if(degree == 'Phd'){
      this.isPhd = true;

      this.isBachelor = false;
      this.isMaster = false;

      this.isMakeChoice = true;
    }else if(degree == 'Master'){
      this.isMaster = true;

      this.isPhd = false;
      this.isBachelor = false;

      this.isMakeChoice = true;
    }else if(degree == 'Bachelor'){
      this.isBachelor = true;
      this.isPhd = false;
      this.isMaster = false;

      this.isMakeChoice = true;
    }
    this.getProgramInfos(degree);
      console.log(this.programs);
  }

  blueChoice(choice : any): void {
  console.log(choice)
  }

  dualCitizenship(choice : any): void {
    console.log(choice)
    console.log(this.selectedValue)
    }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile, this.documentTitle).subscribe(
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

  getProgramInfos(degree : string) {
    this.http.post('http://localhost:3000/app/getProgramInfo', {degree}, this.httpOptions).subscribe(data => {
      this.programs = data;
      console.log(data)

      console.log('Program infos')

      console.log(this.programInfos)
    });
  }

  fileUploadController(): void {
    var isPassTitle = false;
    var isPassName = false;
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      console.log(this.documentTitle)
      console.log(file?.name)
      const fileName = file?.name
      if(this.documentTitle != 'Other Documents'){
        const user_id = this.currentUser.id;

        this.applicationService
          .controlDocumentTitle(this.documentTitle,user_id)
          .subscribe(data => {
            console.log(data);

            if(data == true){
              this.toastr.error('Can upload one file with same title (except other documents)', 'Error')
            }else{
              isPassTitle = true;
            }
          },
          err => {
          })
      }
      const user_id = this.currentUser.id;
      this.applicationService
          .controlDocumentName(fileName,user_id)
          .subscribe(data => {
            console.log(data);

            if(data == true){
              const modalRef = this.modalService.open(NgbdModalContent);
              modalRef.result.then((result) => {
                if (result) {
                  if(result == 'true'){
                    isPassName = true
                  }else if(result == 'false'){
                    this.toastr.error('Document upload cancelled please upload new document', 'Error')
                  }
                }
                });
            }else{
              isPassName = true;
            }
          },
          err => {
          })

    }else{
      this.toastr.error('Please select file for upload', 'Error')
    }
    

    /*
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile, this.documentTitle).subscribe(
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
    */
  }

}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p>A document with the same name has already been uploaded. Do you want to override the document ?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('false')">No</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('true')">Yes</button>
    </div>
  `
})
export class NgbdModalContent {

  constructor(public activeModal: NgbActiveModal) {
  }
}