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
      {path: 'articulos', loadChildren: () => import('../pages/articulos/articulos.module').then(m=>m.ArticulosPageModule)},
      {path: 'detallearticulo', loadChildren: () => import('../pages/detallearticulo/detallearticulo.module').then(m=>m.DetallearticuloPageModule)},
      {path: 'nuevoarticulo', loadChildren: () => import('../pages/nuevoarticulo/nuevoarticulo.module').then(m=>m.NuevoarticuloPageModule)},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
