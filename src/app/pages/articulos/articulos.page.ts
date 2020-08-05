import { Component, OnInit } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import{AuthService} from '../../services/auth.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx'


@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.page.html',
  styleUrls: ['./articulos.page.scss'],
})
export class ArticulosPage implements OnInit {

  constructor(public platform: Platform,private popoverctrl: PopoverController,public Authservicies: AuthService,private fcm: FCM) { 
    }

  ngOnInit() {
    
      this.fcm.getToken().then(token=>{
        console.log(token);
        this.saveToken(token);
      });
    
  }
  saveToken(token){
    this.Authservicies.updateToken(token);
  }


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
