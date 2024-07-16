import { NgModule } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from '../welcome/welcome.component';
import { AuthGuardService } from '../auth/auth-guard.service';



@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', component: SignUpComponent},
      {path: 'login', component: LoginComponent},
      {path: 'welcome', component: WelcomeComponent ,canActivate : [AuthGuardService]}
  ], {scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
