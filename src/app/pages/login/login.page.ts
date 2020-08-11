import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{AuthService} from '../../services/auth.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  token: string;


  constructor(private fcm: FCM,private authService: AuthService,private router: Router, private AFauth: AngularFireAuth) { }

  ngOnInit() {
    this.fcm.getToken().then(token=>{
      console.log(token);
      this.token=token;
    });
  }
  //Verificacion usuario dispone de cuenta y datos para ingreso al sistema
  verificacionLogin(){
    console.log("Entro a la funcion");
    this.authService.login(this.email, this.password).then(res =>{
      this.authService.verificacionDatos().then(resd=>{
        this.router.navigate(['home/articulos']);
        var tok=this.token
        if(tok!=null){
          console.log("Token............................."+this.token);
          this.authService.updateToken(this.token);
        }
      })
      this.router.navigate(['registro']);
    }).catch(err => alert('Los datos son incorrectos o el usuario no existe'));
  }
  //Restablecer contraseña de usuario.
  resetPassword(){
    if (!this.email) { 
      alert('Ingrese su email!'); 
    }
    this.authService.resetPasswordInit(this.email) 
    .then(
      () => {
      this.router.navigate(['']);  
      alert('Correo electronico para restablecer su contraseña fue enviado!'), 
      (rejectionReason) => alert(rejectionReason);
      
    }) 
    .catch(e => alert('Error al tratar de restablecer contraseña')); 
  }
  //navegacion al welcome
  navigateIndex(){
    this.router.navigate(['']);
  }
  //navegacion creacion de cuenta
  navigateSignup(){
    this.router.navigate(['signup']);
  }
  
}
