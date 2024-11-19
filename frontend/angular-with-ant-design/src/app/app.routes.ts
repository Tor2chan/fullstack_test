import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { OverlayComponent } from './overlay/over.component';

export const routes: Routes = [
  {path: '', component: OverlayComponent,
    children: [
      {path: '', redirectTo: 'signin', pathMatch: 'full'},
      { path: 'signin',  component: WelcomeComponent},
      { path: 'signup',  component: SignupComponent},
      { path: 'home', component: HomeComponent},
      {path: '**', redirectTo: 'home'}
    ]
  }
];
