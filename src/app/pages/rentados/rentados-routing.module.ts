import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentadosPage } from './rentados.page';

const routes: Routes = [
  {
    path: '',
    component: RentadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentadosPageRoutingModule {}
