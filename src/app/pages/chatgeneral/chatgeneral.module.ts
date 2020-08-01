import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatgeneralPageRoutingModule } from './chatgeneral-routing.module';

import { ChatgeneralPage } from './chatgeneral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatgeneralPageRoutingModule
  ],
  declarations: [ChatgeneralPage]
})
export class ChatgeneralPageModule {}
