import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { SuccesRegisterComponent } from './components/succes-register/succes-register.component';
import { SuccessAppComponent } from './components/success-app/success-app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RequestPageComponent } from './components/request-page/request-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AgencyProfileComponent } from './components/agency-profile/agency-profile.component';
import { ForgetPassComponent } from './components/forget-pass/forget-pass.component';
import { NewPassComponent } from './components/new-pass/new-pass.component';
import { CreateApplicationComponent } from './components/create-application/create-application.component';
import { UploadFilesComponent } from './components/upload-doc/upload-doc.component';
import { LoginGuardGuard } from './login-guard.guard';
import { ProfileGuard } from './profile.guard';
import { HiProfileComponent } from './components/hi-profile/hi-profile.component';


const routes: Routes = [
  { path: "", component:  HomePageComponent},
  { path: "login", component: LoginComponent, canActivate: [LoginGuardGuard] },
  { path: "signup", component: SignupComponent, canActivate: [LoginGuardGuard] },
  { path: "successRegister", component: SuccesRegisterComponent },
  { path: "successApp", component: SuccessAppComponent },
  { path: "notFound", component: NotFoundComponent},
  { path: "profile", component: ProfileComponent, canActivate: [ProfileGuard]},
  { path: "applicationPage", component: RequestPageComponent},
  { path: "settings", component: SettingsComponent},
  { path: "agencyProfile", component: AgencyProfileComponent},
  { path: "createApplication", component: CreateApplicationComponent},
  { path: "forgetPass", component: ForgetPassComponent},
  { path: "newPass/:email", component: NewPassComponent},
  { path: "uploadFile", component: UploadFilesComponent},
  { path: "hiProfile",component:HiProfileComponent},
  { path: "**", redirectTo: "notFound" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
