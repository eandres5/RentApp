import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatgeneralPage } from './chatgeneral.page';

const routes: Routes = [
  {
    path: '',
    component: ChatgeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatgeneralPageRoutingModule {}
