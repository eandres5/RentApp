import { Component, OnInit } from '@angular/core';
import {ReadchatsService} from '../../services/readchats.service';
import {AuthService} from '../../services/auth.service';
export interface chat {
  descripcion: string
  nombre: string
  id: string
  img: string,
  users:{
    userr:string,
    uidp:string
  }
} 
import { PopoverController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import {ChatComponent} from 'src/app/components/chat/chat.component';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-chatgeneral',
  templateUrl: './chatgeneral.page.html',
  styleUrls: ['./chatgeneral.page.scss'],
})
export class ChatgeneralPage implements OnInit {
  public chatsR : any =[];
  public to: string;
  constructor(private popoverctrl: PopoverController,public Authservice: AuthService, public chatservice: ReadchatsService,private modal:ModalController ) { }



  ngOnInit() {
    this.obtenerChat();
  }
  obtenerChat(){
    
    this.chatservice.getChats().subscribe( chats=>{
      this.Authservice.isAuth().subscribe(user=>{
        this.chatsR=[];
        for (let i = 0; i < chats.length; i++) {
          if(chats[i].users.uidp==user.uid || chats[i].users.userr==user.uid){
            this.chatsR[i]=chats[i];
          }
        }
      })
    });
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

  openchat(chat){
    this.modal.create({
      component: ChatComponent, 
      componentProps :{
        chat : chat
      }
    }).then((modal)=> modal.present());
  }

}
