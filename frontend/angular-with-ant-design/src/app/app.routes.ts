import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { OverlayComponent } from './overlay/over.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { UserInfoChangePictureComponent } from './pages/user-info/user-info-change-picture/user-info-change-picture.component';
import { UserInfoChangeNameComponent } from './pages/user-info/user-info-change-name/user-info-change-name.component';
export const routes: Routes = [
  {path: '', component: OverlayComponent,
    children: [
      {path: '', redirectTo: 'user-info', pathMatch: 'full'},
      { path: 'signin',  component: SigninComponent},
      { path: 'signup',  component: SignupComponent},
      { path: 'admin', component: HomeComponent},
      { path: 'user-info', component: UserInfoComponent},
      { path: 'user-info/change-picture', component: UserInfoChangePictureComponent},
      { path: 'user-info/change-name', component: UserInfoChangeNameComponent},
      {path: '**', redirectTo: 'user-info'}
    ]
  }
];
