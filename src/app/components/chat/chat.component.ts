import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { clsmensaje } from 'src/app/backend/clsmensaje';
import { ReadchatsService } from 'src/app/services/readchats.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
interface usuarioss {
  uid: string,
  nombre: string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public chats: any;
  public usuarios: any = [];
  public uid: string;
  public sms: clsmensaje;
  public room: any;
  public nombre: string;
  public mens: string;

  constructor(private navparame: NavParams, private modal: ModalController, private chatService: ReadchatsService,
    private AuthService: AuthService, private AngularFire: AngularFireAuth) { }

  ngOnInit() {
    this.chats = this.navparame.get('chat');
    this.obtenerUu();
    this.obtenerSMS(this.chats.id);
  }
  obtenerSMS(id: string){
    this.chatService.getChatRoom(id).subscribe(room => {
      this.room = room;
    })
  }
  obtenerUu() {
    this.AngularFire.authState.subscribe(user => {
      if(user){
        this.AuthService.obtenernombreUsuario(user.uid).subscribe(usa => {
          const data2: usuarioss = usa.payload.data() as usuarioss;
          this.nombre = data2.nombre;
        });
      } 
    })

  }


  cerrarChat() {
    this.modal.dismiss();
  }
  enviarsms() {
    const mensaje: clsmensaje = {
      nombre: this.nombre,
      textosms: this.mens,
      type: 'text',
      date: new Date()
    }
    var enviado= this.chats.nombre+ " ( "+ this.chats.creado+" )";
    this.chatService.sendsmsFire(mensaje, this.chats.id, enviado);
    this.mens = "";
  }

}
