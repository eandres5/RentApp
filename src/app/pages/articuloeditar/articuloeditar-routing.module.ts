import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticuloeditarPage } from './articuloeditar.page';

const routes: Routes = [
  {
    path: '',
    component: ArticuloeditarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticuloeditarPageRoutingModule {}
