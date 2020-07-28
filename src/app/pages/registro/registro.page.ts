import { Component, OnInit } from '@angular/core';
//importaciones de servicio de Auth
import {AuthService} from '../../services/auth.service';
//importacion de clase clsProfile
import {clsprofile} from '../../backend/clsprofile';
//Router
import {Router} from '@angular/router';
//librerias de autenticacion y Storage de Firebase
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
//Librerias para observables y Finalize
import { finalize } from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  //variables para almacenar datos de usuarios
  public nombre: string;
  public apellido: string;
  public tel: number;
  public URL: string;
  public image: string;
//invocacion a la interface de clsprofile
  clsprofile = {} as clsprofile;

//observable para imagen
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  constructor(private auth: AuthService, private db: AngularFirestore, private authF: AngularFireAuth, private router: Router, private storage: AngularFireStorage) { }

  ngOnInit() {
  }
  //carga de imagen en Firestorage
  onUpload(e){
    //Obtencion de Usuario Logueado
    this.auth.isAuth().subscribe(user=>{
      //Constante con el evento de imagen
      const file = e.target.files[0];
    const filePath = `Perfiles/profile_${user.uid}`;
    const ref= this.storage.ref(filePath);
    //Guarda la imagen en el Storage
    const task = this.storage.upload(filePath, file);
    //Porcentaje de subida de imagen
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(()=> this.urlImage = ref.getDownloadURL())).subscribe();
    task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
      console.log("Imagen subida");
      const downloadURL = ref.getDownloadURL();
      downloadURL.subscribe(url=>{
        if(url){
          console.log(url);
          this.image = url;
        }
      })
    })
    })
    
    
  }
  //Actualizacion de Perfil 
  updateProfile(){
    this.authF.authState.subscribe(auth=>{
    this.db.collection('users').doc(auth.uid).update({nombre:this.nombre, 
      apellido: this.apellido, 
      telefono: this.tel,
      urlimage: this.image
      }).then(()=>{
        this.auth.isAuth().subscribe(user =>{
          if(user){
            user.updateProfile({
              displayName: this.nombre+" "+this.apellido,
              photoURL: this.image,
            }).then(function(){
              console.log('User Update');
                        
            }).catch(function(error){
              console.log('error',error);
            });
          }
        });
        this.router.navigate(['\chat']);
        
      }).catch(function(err){
        console.log(err);
      });
      

  })
}

}
