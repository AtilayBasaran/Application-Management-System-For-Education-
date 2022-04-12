import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./components/home/home.component";
import { PostsComponent } from "./components/posts/posts.component";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { EngApplicationComponent } from './components/eng-application/eng-application.component';
import { TrApplicationComponent } from './components/tr-application/tr-application.component';
import { SuccesRegisterComponent } from './components/succes-register/succes-register.component';
import { SuccessAppComponent } from './components/success-app/success-app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "engApplication", component: EngApplicationComponent },
  { path: "trApplication", component: TrApplicationComponent },
  { path: "successRegister", component: SuccesRegisterComponent },
  { path: "successApp", component: SuccessAppComponent },
  { path: "notFound", component: NotFoundComponent},
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
