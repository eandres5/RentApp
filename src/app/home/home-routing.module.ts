import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ArticulosPageModule } from '../pages/articulos/articulos.module';
import { DetallearticuloPageModule } from '../pages/detallearticulo/detallearticulo.module';
import { NuevoarticuloPageModule } from '../pages/nuevoarticulo/nuevoarticulo.module';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    //se cargan todas las paginas una vez autenticado el usuario
    //paginas que se mostraran con el menu tabs
    children: [
      { 
        path: 'articulos', 
        loadChildren: () => import('../pages/articulos/articulos.module').then(m => m.ArticulosPageModule) },
      { 
        path: 'detallearticulo', 
        loadChildren: () => import('../pages/detallearticulo/detallearticulo.module').then(m => m.DetallearticuloPageModule) },
      { 
        path: 'nuevoarticulo', 
        loadChildren: () => import('../pages/nuevoarticulo/nuevoarticulo.module').then(m => m.NuevoarticuloPageModule) },
      { 
        path: 'profile', 
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule) },
      { 
        path: 'chatgeneral', 
        loadChildren: () => import('../pages/chatgeneral/chatgeneral.module').then(m => m.ChatgeneralPageModule)},
      {
        path: 'detallever/:id',
        loadChildren: () => import('../pages/detallever/detallever.module').then( m => m.DetalleverPageModule)},
      { 
        path: 'articuloeditar/:id',
        loadChildren: () => import('../pages/articuloeditar/articuloeditar.module').then( m => m.ArticuloeditarPageModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
