import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticulosPageRoutingModule } from './articulos-routing.module';

import { ArticulosPage } from './articulos.page';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  entryComponents:[
    MorebtnComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticulosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ArticulosPage]
})
export class ArticulosPageModule {}
