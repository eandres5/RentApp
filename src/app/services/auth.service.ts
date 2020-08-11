import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
//interface de usuarios

interface usuarioss {
  uid: string,
  token: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth: AngularFireAuth, private router: Router, private db: AngularFirestore) { }
  //Servicio de login
  login(usuario: string, password: string) {
    //retorna promesa del usuario.
    return new Promise((resolve, rejected) => {
      //Logueo de usuario con email y password 
      this.AFauth.signInWithEmailAndPassword(usuario, password).then(user => {
        //Verificacion de cuenta verificada por email.
        this.AFauth.onAuthStateChanged(function (userv) {
          var emailVerificado = userv.emailVerified;
          console.log(userv.uid);
          if (emailVerificado == true) {
            console.log("Email verificado");
            resolve(user)
          } else {
            console.log("Email no verificado ");
          }
        })
      }).catch(err => rejected(err));
    })
  }
  //funcion para obtener nombre de usuario.
  obtenernombreUsuario(uid: string) {
    return this.db.collection('users').doc(uid).snapshotChanges();
  }
  //Funcion para el registro de token 
  guardarToken(ui: string, tokenr: string) {
    console.log(ui);
    this.db.collection('users').doc(ui).update({ token: tokenr });
  }
  //Funcion para update el token en caso de que el usuario haya cambiado de equipo
  updateToken(tokenr: string) {
    this.isAuth().subscribe(user => {
      this.guardarToken(user.uid, tokenr);
    });
  }
  //Cierre de Sesion
  logout() {
    this.AFauth.signOut().then(auth => {
      this.router.navigate(['']);
    })
  }
  //registrar Chat
  registrarChat(nombre: string, detalle: string, img: string, idp:string) {
    this.isAuth().subscribe(user => {
      var userid = user.uid;
      this.db.collection('chats').add({
        nombre: nombre,
        descripcion: detalle,
        img: img,
        users: {
          userr: userid,
          uidp: idp
        }
      })

    })
  }
  //Registro de usuario nuevo
  registrarUsu(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.AFauth.createUserWithEmailAndPassword(email, pass).then(res => {
        console.log(res.user.uid);
        const uid = res.user.uid;
        this.db.collection('users').doc(res.user.uid).set({
          uid: uid,
          correo: email,
          token:""
        })
        this.AFauth.onAuthStateChanged(function (userv) {
          var emailVerificado = userv.emailVerified;
          if (emailVerificado == true) {
            console.log(userv.uid);
            resolve(res);
            console.log("Email verificado");
          } else {
            console.log("Email no verificado");
            userv.sendEmailVerification().then(function () {
              alert('Correo electronico enviado. Verifica tu cuenta!!');
              
            });
          }
        })

      }).catch(err => {
        reject(err)
        console.log(err);
      }
      
      );
    })

  }
  //verificacion de datos
  verificacionDatos() {
    return new Promise((resolve) => {
      this.AFauth.onAuthStateChanged(function (userv) {
        var nameUser = userv.displayName;
        var photourl = userv.photoURL;
        if (nameUser != null && photourl != null) {
          resolve(userv);
        }
      });
    });

  }
  //Restablecer contraseña de los usuarios
  resetPasswordInit(email: string) {
    return this.AFauth.sendPasswordResetEmail(
      email);
  }
  //Usuario autenticado
  isAuth() {
    return this.AFauth.authState.pipe(map(auth => auth));
  }
  //actualizacion de datos usuario
  updateNombreApellido(nombreu: String, apellidou:String){
    this.AFauth.authState.subscribe(auth=>{
      this.db.collection('users').doc(auth.uid).update({nombre: nombreu, 
        apellido: apellidou
        }).then(()=>{
          this.isAuth().subscribe(user =>{
            if(user){
              user.updateProfile({
                displayName: nombreu+" "+apellidou
              }).then(function(){
                console.log('User Update');
                          
              }).catch(function(error){
                console.log('error',error);
              });
            }
          });
        }).catch(function(err){
          console.log(err);
        });
    })
  }
  updatePhone(phone: number){
    this.AFauth.authState.subscribe(auth=>{
      this.db.collection('users').doc(auth.uid).update({telefono: phone 
        }).then(()=>{
          console.log("Actualizado");
        }).catch(function(err){
          console.log(err);
        });
    })
  }

  
}
