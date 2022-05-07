import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SuccessAppComponent } from './components/success-app/success-app.component';
import { SuccesRegisterComponent } from './components/succes-register/succes-register.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AgencyProfileComponent } from './components/agency-profile/agency-profile.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ForgetPassComponent } from './components/forget-pass/forget-pass.component';
import { NewPassComponent } from './components/new-pass/new-pass.component';
import { LoginGuardGuard } from './login-guard.guard';
import { ProfileGuard } from './profile.guard';



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
    SettingsComponent,
    AgencyProfileComponent,
    ForgetPassComponent,
    NewPassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [authInterceptorProviders,LoginGuardGuard,ProfileGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
