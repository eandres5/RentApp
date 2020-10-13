import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import {FormBuilder, Validators, FormGroup, Form, FormControl} from '@angular/forms';
interface user {
  inhabilitado: boolean
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  get emailv(){
    return this.LoginForm.get('emailv');
  }
  email: string;
  password: string;
  token: string;

  public errorMessages = {
    emailv : [
      {type: 'required', message: 'Email es requerido'},
      {type: 'pattern', message: 'Verifique que su correo no tenga espacios al final o al inicio'}
    ]
  }
  LoginForm = this.formBuilder.group({
    emailv: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[epn]+(\\.[edu]+)*(\\.[ec]{2,4})$'), Validators.required])]
  }
  );

  constructor(private formBuilder: FormBuilder, private fcm: FCM, private authService: AuthService, private router: Router, private AFauth: AngularFireAuth) { }

  ngOnInit() {
    this.fcm.getToken().then(token => {
      console.log(token);
      this.token = token;
    });
  }
  //Verificacion usuario dispone de cuenta y datos para ingreso al sistema
  verificacionLogin() {
    console.log("Entro a la funcion");
    this.authService.login(this.LoginForm.value['emailv'], this.password).then(res => {
      this.authService.verificacionDatos().then(resd => {
        this.AFauth.authState.subscribe(ser => {
          this.authService.obtenernombreUsuario(ser.uid).subscribe(usa => {
            const data: user = usa.payload.data() as user;
            if (data.inhabilitado == true) {
              alert("Cuenta Bloqueada!! Contactarse con rentappec@gmail.com");
              this.AFauth.signOut().then(auth => {
                console.log('Sesion cerrada');
                this.router.navigate(['']);
              })
            } else {
              console.log("usuario Habiitado");
              this.router.navigate(['home/articulos']);
              var tok = this.token
              if (tok != null) {
                console.log("Token............................." + this.token);
                this.authService.updateToken(this.token);
              }
            }
          })
        })
      })
      this.router.navigate(['registro']);
    }).catch(err => alert('Los datos son incorrectos o el usuario no existe'));
  }
  //Restablecer contraseña de usuario.
  resetPassword() {
    this.email= this.LoginForm.value['emailv'];
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
  navigateIndex() {
    this.router.navigate(['']);
  }
  //navegacion creacion de cuenta
  navigateSignup() {
    this.router.navigate(['signup']);
  }

}
