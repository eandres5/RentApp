import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from './index.page';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { LoginPage } from '../pages/login/login.page';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';

//guards
import {AuthGuard} from '../guards/auth.guard';
import {SignoutGuard} from '../guards/signout.guard';
import {RegistroGuard} from '../guards/registro.guard';


const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    //se cargar las paginas de login
    children: [
      {
        path: '',
        loadChildren: () => import('../pages/welcome/welcome.module').then(m => m.WelcomePageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule),canActivate:[SignoutGuard]
      },
      {
        path: 'signup',
        loadChildren: () => import('../pages/signup/signup.module').then(m => m.SignupPageModule),canActivate:[SignoutGuard]
      },
      {
        path: 'registro',
        loadChildren: () => import('../pages/registro/registro.module').then(m => m.RegistroPageModule),canActivate:[RegistroGuard]
      },
      {
        path: 'politicas',
        loadChildren: () => import('../pages/politicas/politicas.module').then(m => m.PoliticasPageModule),canActivate:[SignoutGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule { }
