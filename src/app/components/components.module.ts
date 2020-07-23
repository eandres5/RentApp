import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesComponent } from './slides/slides.component';
import { StartComponent } from './start/start.component';
import { LogoComponent } from './logo/logo.component';
import { MorebtnComponent } from './morebtn/morebtn.component';



@NgModule({
  declarations: [SlidesComponent, StartComponent, LogoComponent, MorebtnComponent],
  exports: [ SlidesComponent, StartComponent, LogoComponent, MorebtnComponent ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
