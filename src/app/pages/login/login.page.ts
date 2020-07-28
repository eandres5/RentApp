import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{AuthService} from '../../services/auth.service';

import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;


  constructor(private authService: AuthService,private router: Router, private AFauth: AngularFireAuth) { }

  ngOnInit() {
  }
  //Verificacion usuario dispone de cuenta y datos para ingreso al sistema
  verificacionLogin(){
    console.log("Entro a la funcion");
    this.authService.login(this.email, this.password).then(res =>{
      this.authService.verificacionDatos().then(resd=>{
        this.router.navigate(['home/articulos']);
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
