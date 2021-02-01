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
  img: string,
  users:{
    userr:string,
    uidp:string
  }
} 
interface sms{
  users:{
    userr:string,
    uidp:string
  }
}
interface user{
  uid: string,
  nombre: string,
  apellido: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class ReadchatsService {
  //variables
  public uid: string;
  public token: string;
  public tokenn: string;
  public usuarioen: string;
  public usuarioArticulo: string;
  public chats : any =[];
  constructor(public http:HttpClient,private db: AngularFirestore, public Authservicies: AuthService) { }
  //funciones
  //obtener chats
  
  getChats(){
    this.Authservicies.isAuth().subscribe(user=>{
      if(user){
        this.uid= user.uid;
      }
    })
    return this.db.collection('chats').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data: chat =a.payload.doc.data() as chat;
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
    })
  }
  //obtencion de chats individualmente
  getChatRoom(idchat: string){
    console.log(idchat);
    var id= idchat;
    this.obtenertoken(id);
    return this.db.collection('chats').doc(idchat).valueChanges();
  }
//envio de mensaje y notificacion a usuarios
  sendsmsFire(mensaje : clsmensaje, idchat : string, enviado: string){
    this.db.collection('chats').doc(idchat).update({
      mensajes: firestore.FieldValue.arrayUnion(mensaje),
    })
    var sms= mensaje.textosms;
    var nombre = mensaje.nombre;
    console.log(enviado);
    this.sendNotifi(sms, nombre, enviado);
    
  }
  //envio de notificaciones con la utilizacion de api FCM y metodo post.
  sendNotifi(sms: string, nombre: string, enviado: string){
    console.log("entro a la funcion"+ sms + nombre+ this.token);
          let options = {headers: new HttpHeaders({'Authorization': 'key=AAAAkptO3BA:APA91bFn2799tCDyL7TXPwMUaPeFo5p2_WyL49jyUbmj3WZb-DwIhhvnNClL6DLgeo769XsosUs9lXqDj2pWjqtP3pATpCWqVifywm7Tu6hazA0A-0f0RflQ9juUcERpHrz-Gqnv_oxM',
           'Content-Type': 'application/json' })}
           //estructura de notificacion.
          let notification = {
            "notification": {
              "title": enviado,
              "body":"[De: "+nombre+ "]: \n "+ sms,
              "click_action": "FCM_PLUGIN_ACTIVITY",
              "sound": "default",
              "icon": "ic_launcher"
            }, "data": {
              
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

  enviarNotificacionRenta(idusuariotoken:string, titulo:string ){
    
    console.log(idusuariotoken);
    this.db.collection("users").doc(idusuariotoken).snapshotChanges().subscribe( usu=>{
      const data3 : user = usu.payload.data() as user;
        var tokennn= data3.token;
        var nombre= data3.nombre+ " " + data3.apellido;
        this.tokenn= tokennn;
        this.usuarioArticulo=nombre;
        console.log(this.tokenn);
        console.log(this.usuarioArticulo);
        this.sendnotificacionRenta(titulo, this.usuarioArticulo);
    })
    
    
  }

  sendnotificacionRenta(titulo:string, nombre: string){
    console.log("entro a la funcion"+ titulo + nombre+ this.tokenn);
          let options = {headers: new HttpHeaders({'Authorization': 'key=AAAAkptO3BA:APA91bFn2799tCDyL7TXPwMUaPeFo5p2_WyL49jyUbmj3WZb-DwIhhvnNClL6DLgeo769XsosUs9lXqDj2pWjqtP3pATpCWqVifywm7Tu6hazA0A-0f0RflQ9juUcERpHrz-Gqnv_oxM',
           'Content-Type': 'application/json' })}
           //estructura de notificacion.
          let notification = {
            "notification": {
              "title": titulo,
              "body":"Alguien desea rentar tu artículo, Ingresa a la sección mis artículos para confirmar.",
              "click_action": "FCM_PLUGIN_ACTIVITY",
              "sound": "default",
              "icon": "ic_launcher"
            }, "data": {
              
            },
            "to": this.tokenn
          }
          let url = 'https://fcm.googleapis.com/fcm/send';
          this.http.post(url, notification, options).subscribe(data => {
            console.log('enviado');
        }, error => {
            console.log('error saving token', error);
        });
  }

}
