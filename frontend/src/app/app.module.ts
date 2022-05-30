import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SuccessAppComponent } from './components/success-app/success-app.component';
import { SuccesRegisterComponent } from './components/succes-register/succes-register.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RequestPageComponent } from './components/request-page/request-page.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AgencyProfileComponent } from './components/agency-profile/agency-profile.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ForgetPassComponent } from './components/forget-pass/forget-pass.component';
import { NewPassComponent } from './components/new-pass/new-pass.component';
import { NgbdModal1Content } from './components/home-page/home-page.component';
import { NgbdModal2Content } from './components/home-page/home-page.component';
import { LoginGuardGuard } from './login-guard.guard';
import { ProfileGuard } from './profile.guard';
import { CreateApplicationComponent } from './components/create-application/create-application.component';
//import { UploadFilesComponent } from './components/upload-doc/upload-doc.component';
import { HiProfileComponent } from './components/hi-profile/hi-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgramsComponent } from './components/programs/programs.component';
import { DenemeComponent } from './components/deneme/deneme.component';
import { HodApplicationComponent } from './components/hod-application/hod-application.component';
import { NgbdModal3Content } from './components/hod-application/hod-application.component';
import { NgbdModal4Content } from './components/hod-application/hod-application.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SignupComponent,
    LoginComponent,
    ProfileComponent,
    FooterComponent,
    NotFoundComponent,
    SuccessAppComponent,
    SuccesRegisterComponent,
    HomePageComponent,
    RequestPageComponent,
    SettingsComponent,
    AgencyProfileComponent,
    ForgetPassComponent,
    NewPassComponent,
    CreateApplicationComponent,
    //UploadFilesComponent,
    NgbdModal1Content,
    NgbdModal3Content,
    HiProfileComponent,
    NgbdModal2Content,
    ProgramsComponent,
    DenemeComponent,
    HodApplicationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    MatExpansionModule
  ],
  providers: [authInterceptorProviders,LoginGuardGuard,ProfileGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
