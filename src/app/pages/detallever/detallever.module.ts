import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleverPageRoutingModule } from './detallever-routing.module';

import { DetalleverPage } from './detallever.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleverPageRoutingModule
  ],
  declarations: [DetalleverPage]
})
export class DetalleverPageModule {}
