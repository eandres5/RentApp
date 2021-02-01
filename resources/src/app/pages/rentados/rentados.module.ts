import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentadosPageRoutingModule } from './rentados-routing.module';

import { RentadosPage } from './rentados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentadosPageRoutingModule
  ],
  declarations: [RentadosPage]
})
export class RentadosPageModule {}
