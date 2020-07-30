import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from './index.page';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { LoginPage } from '../pages/login/login.page';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';

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
        loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('../pages/signup/signup.module').then(m => m.SignupPageModule)
      },
      {
        path: 'registro',
        loadChildren: () => import('../pages/registro/registro.module').then(m => m.RegistroPageModule)
      },
      {
        path: 'politicas',
        loadChildren: () => import('../pages/politicas/politicas.module').then(m => m.PoliticasPageModule)
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
