import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';

@Component({
  selector: 'app-chatgeneral',
  templateUrl: './chatgeneral.page.html',
  styleUrls: ['./chatgeneral.page.scss'],
})
export class ChatgeneralPage implements OnInit {

  constructor(private popoverctrl: PopoverController) { }

  ngOnInit() {
  }

  //funcion popover 
  async mostrarpop(evento){
    
    const popover = await this.popoverctrl.create({
      component: MorebtnComponent,
      event: evento,
      translucent: true,
      mode: 'ios'
    });

    return await popover.present();
  }
}
