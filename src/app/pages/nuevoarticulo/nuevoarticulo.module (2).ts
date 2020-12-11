import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoarticuloPageRoutingModule } from './nuevoarticulo-routing.module';

import { NuevoarticuloPage } from './nuevoarticulo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevoarticuloPageRoutingModule
  ],
  declarations: [NuevoarticuloPage]
})
export class NuevoarticuloPageModule {}
