import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import{clsmensaje} from '../backend/clsmensaje';
import {firestore} from 'firebase';
import{AuthService} from '../services/auth.service';
import {HttpClient,HttpHeaders,HttpRequest} from '@angular/common/http';

//interfaces 
export interface chat {
  descripcion: string
  nombre: string
  id: string
  img: string
} 
interface sms{
  users:{
    userr:string,
    uidp:string
  }
}
interface user{
  uid: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class ReadchatsService {
  //variables
  public uid: string;
  public token: string;
  public usuarioen: string;
  constructor(public http:HttpClient,private db: AngularFirestore, public Authservicies: AuthService) { }
  //funciones
  //obtener chats
  getChats(){
    this.Authservicies.isAuth().subscribe(user=>{
      this.uid= user.uid;
    })
    return this.db.collection('chats').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data =a.payload.doc.data() as chat;
        data.id= a.payload.doc.id;
        return data;
      })
    }));
    
  }
  //obtener token de usuarios dentro de chat
  obtenertoken(idchat: string){
    this.db.collection("chats").doc(idchat).snapshotChanges().subscribe(
      mens =>{
        const data2 : sms = mens.payload.data() as sms;
        var usere=data2.users.userr;
        var userpe= data2.users.uidp;
        if(this.uid==usere){
          this.usuarioen= userpe;
        }else{
          if(this.uid==userpe){
            this.usuarioen= usere;
          }
        }
        this.obtenertokenUsu(this.usuarioen);
      });
    
  }
  //token de usuario para envio de notificacion
  obtenertokenUsu(idusuario: string){
    this.db.collection("users").doc(idusuario).snapshotChanges().subscribe( usu=>{
      const data3 : user = usu.payload.data() as user;
        var token= data3.token;
        this.token= token;
        console.log(token);
    })
  }
  //obtencion de chats individualmente
  getChatRoom(idchat: string){
    this.obtenertoken(idchat);
    return this.db.collection('chats').doc(idchat).valueChanges();
  }
//envio de mensaje y notificacion a usuarios
  sendsmsFire(mensaje : clsmensaje, idchat : string){
    this.db.collection('chats').doc(idchat).update({
      mensajes: firestore.FieldValue.arrayUnion(mensaje),
    })
    var sms= mensaje.textosms;
    var nombre = mensaje.nombre;
    this.sendNotifi(sms, nombre);
    
  }
  //envio de notificaciones con la utilizacion de api FCM y metodo post.
  sendNotifi(sms: string, nombre: string){
    console.log("entro a la funcion"+ sms + nombre+ this.token);
          let options = {headers: new HttpHeaders({'Authorization': 'key=AAAAkmwxglM:APA91bFu2i8ZGtKeNU1-GIE01xXSf94nzXaSfKbi98N9ftmBgGP2Dwct_hybaWl22HYBJAnh1bzRPZ-0MZc8YoFuMaqghFoR0RSZwPQRCUin4zwQ7cF6hUwjK3bDXU7NWG2nMs5dGKDu',
           'Content-Type': 'application/json' })}
           //estructura de notificacion.
          let notification = {
            "notification": {
              "title": sms,
              "body": 'De:'+nombre,
              "click_action": "FCM_PLUGIN_ACTIVITY",
              "sound": "default"
            }, "data": {
              //OPTIONAL PARAMS
            },
            "to": this.token
          }
          let url = 'https://fcm.googleapis.com/fcm/send';
          this.http.post(url, notification, options).subscribe(data => {
            console.log('enviado');
        }, error => {
            console.log('error saving token', error);
        });
  }

}
