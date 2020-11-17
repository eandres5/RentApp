import { Component, OnInit } from '@angular/core';
//importaciones de servicio de Auth
import {AuthService} from '../../services/auth.service';
//importacion de clase clsProfile
import {clsprofile} from '../../backend/clsprofile';
//Router
import {Router} from '@angular/router';
//librerias de autenticacion y Storage de Firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
//Librerias para observables y Finalize
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
//Formulario
import {FormBuilder, Validators, FormGroup, Form, FormControl} from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Photo } from 'src/app/models/foto.interface';
import { File } from '@ionic-native/file/ngx';
import { AlertController , Platform} from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  get nombrev(){
    return this.profileForm.get('nombrev');
  }
  get apellidov(){
    return this.profileForm.get('apellidov');
  }
  get telv(){
    return this.profileForm.get('telv');
  }
  public errorMessages = {
    nombrev : [
      {type: 'required', message: 'Nombre es Requerido'},
      {type: 'pattern', message: 'Ingrese su Nombre'}
    ],
    apellidov : [
      {type: 'required', message: 'Apellido es requerido'},
      {type: 'minlength', message: 'Ingrese su Apellido'}
    ],
    telv: [
      {type: 'pattern', message: 'Ingrese correctamente su numero de celular'}
    ]

  }

  profileForm = this.formBuilder.group({
    nombrev: ['', [Validators.required, Validators.minLength(5)]],
    apellidov: ['', Validators.compose([Validators.minLength(3),  Validators.required])],
    telv: ['', Validators.pattern("^((\\+593-?)|0)?[0-9]{9}$")]
  });
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
  imagePath: string;
  iduser: string;
  public c: string;
  
  constructor(private camera: Camera,
    private platform: Platform,
    private file: File,
    public alertController: AlertController,
    private formBuilder: FormBuilder, 
    private auth: AuthService, 
    private db: AngularFirestore, 
    private authF: AngularFireAuth, 
    private router: Router, 
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.auth.isAuth().subscribe(user=>{
      this.iduser=user.uid;
    })
    this.c="assets/images/camera.png";
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
          this.c=this.image;
        }
      })
    })
    })
    
    
  }
  //Actualizacion de Perfil 
  updateProfile(){
    
    this.authF.authState.subscribe(auth=>{
    this.db.collection('users').doc(auth.uid).update({nombre:this.profileForm.value['nombrev'], 
      apellido: this.profileForm.value['apellidov'], 
      telefono: this.profileForm.value['telv'],
      urlimage: this.image
      }).then(()=>{
        this.auth.isAuth().subscribe(user =>{

          if(user){
            user.updateProfile({
              displayName: this.profileForm.value['nombrev']+" "+this.profileForm.value['apellidov'],
              photoURL: this.image,
            }).then(function(){
              console.log('User Update');
                        
            }).catch(function(error){
              console.log('error',error);
            });
          }
        });
        this.router.navigate(['login']);
        
      }).catch(function(err){
        console.log(err);
      });
  })
  
}
async addPhoto(source: string) {

  switch (source) {
    case 'camera': {
      console.log('camera');
      const cameraPhoto = await this.openCamera();
      this.image = cameraPhoto;
      console.log(this.image);

      const fileURI = this.image;
      let file: string;

      if (this.platform.is('ios')) {
        file = fileURI.split('/').pop();
      } else {
        file = fileURI.substring(fileURI.lastIndexOf('/') + 1);
        console.log(file);
      }
      const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));

      console.log(path);

      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });
      const id = this.iduser;
      console.log(id);
      this.imagePath = `Perfiles/profile_${id}` + '.jpg';

      const ref = this.storage.ref(this.imagePath);
      const task = ref.put(blob);

      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize(() => this.urlImage = ref.getDownloadURL())
      ).subscribe();
      task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
        console.log("Imagen subida");
        const downloadURL = ref.getDownloadURL();
        downloadURL.subscribe(url=>{
          if(url){
            console.log(url);
            this.image = url;
            this.c=this.image;
          }
        });
      })

      break;
    }
    case 'library': {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.image = libraryImage;
      console.log(this.image);

      const fileURI = this.image;
      let file: string;

      if (this.platform.is('ios')) {
        file = fileURI.split('/').pop();
      } else {
        file = fileURI.substring(fileURI.lastIndexOf('/') + 1, fileURI.indexOf('?'));
        console.log("aqui");
        console.log(file);
      }

      const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));

      console.log(path);

      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });

      const id = this.iduser;
      console.log(id);
      this.imagePath = `Perfiles/profile_${id}` + '.jpg';

      const ref = this.storage.ref(this.imagePath);
      const task = ref.put(blob);

      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize(() => this.urlImage = ref.getDownloadURL())
      ).subscribe();
      task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
        console.log("Imagen subida");
        const downloadURL = ref.getDownloadURL();
        downloadURL.subscribe(url=>{
          if(url){
            console.log(url);
            this.image = url;
            this.c=this.image;
          }
        });
      })
      break;
    }
  }
}


//funciones para abrir la camara
async openLibrary() {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 1000,
    targetHeight: 1000,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };
  return await this.camera.getPicture(options);
}

async openCamera() {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 1000,
    targetHeight: 1000,
    sourceType: this.camera.PictureSourceType.CAMERA
  };
  return await this.camera.getPicture(options);
}

async presentAlertCamera() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    message: '<strong>Seleccione:</strong>!!!',
    buttons: [
       {
        text: 'Camara',
        handler: () => {
          console.log('Camara');
          this.addPhoto('camera');
        }
      },
      {
        text: 'Galeria',
        handler: () => {
          console.log('Galeria');
          this.addPhoto('library');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }
    ]
  });

  await alert.present();
}


}
