import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoarticuloPage } from './nuevoarticulo.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoarticuloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoarticuloPageRoutingModule {}
