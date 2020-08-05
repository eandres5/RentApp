import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleverPage } from './detallever.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleverPageRoutingModule {}
