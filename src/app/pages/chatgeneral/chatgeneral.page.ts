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
@Component({
  selector: 'app-chatgeneral',
  templateUrl: './chatgeneral.page.html',
  styleUrls: ['./chatgeneral.page.scss'],
})
export class ChatgeneralPage implements OnInit {
  public chatsR : any =[];
  public to: string;
  constructor(public Authservice: AuthService, public chatservice: ReadchatsService) { }

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

}
