import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { AlertController , Platform} from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Photo } from 'src/app/models/foto.interface';
import { File } from '@ionic-native/file/ngx';

interface user{
  uid:string,
  nombre: string,
  apellido: string,
  celular: string,
  correo: string, 
  img: string
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  imagePath: string;
  public usersR : any =[];
  public image: string;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  constructor(private camera: Camera,
    private platform: Platform,
    private file: File,
    private router: Router, private auth: AuthService,public alertController: AlertController,
    private storage: AngularFireStorage, 
    private db: AngularFirestore, private authF: AngularFireAuth) { }

  ngOnInit() {
    //inicia datos usuario
    this.datosUsuario();
  }
  //funcion para obtener datos usuario
  datosUsuario(){
    this.usersR=[];
    this.auth.isAuth().subscribe(us=>{
      if(us){
        this.auth.obtenernombreUsuario(us.uid).subscribe(usa=>{
          const data2 : user = usa.payload.data() as user;
          this.usersR[0]=data2;
          console.log(this.usersR);
        });
      }
   }
     )
  }
  //navegacion para home/articulos
  navigateArticulos(){
    this.router.navigate(['home/articulos']);
  }
  //AlertActualizacion Nombre y Apellido
  async presentAlertNombreApellido() {
    const alerta = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Escriba su nombre y Apellido',
      inputs: [
        {
          name: 'nombre',
          type: 'text', 
          id: 'nombre',
          value: this.usersR[0].nombre,
          placeholder: 'Nombre'
        },
        {
          name: 'apellido',
          type: 'text',
          id: 'apellido',
          value: this.usersR[0].apellido,
          placeholder: 'Apellido'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            //Validacion datos de usuario no esten vacios
            if(data.nombre!="" && data.apellido!="" ){
              this.auth.updateNombreApellido(data.nombre,data.apellido);
            }else{
              
              alert('Ingrese nombre y apellido');
              return false;
            }
            
          }
        }
      ]
    });

    await alerta.present();
  }
  //Alerta para modificacion de Celular
  async presentAlertCellphone() {
    const alerta = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Ingrese numero Celular',
      inputs: [
        {
          name: 'telefono',
          type: 'tel', 
          id: 'telefono',
          value: this.usersR[0].telefono,
          attributes: {
            minlength:10,
            maxlength: 10
          },
          placeholder: 'Número Celular'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            const tel= data.telefono;
            //verificacion de celular no este vacio y esten 10 digitos
            if(data.telefono!="" && tel.length==10){
              this.auth.updatePhone(data.telefono);
            }else{
              alert('Ingrese el numero correctamente');
              return false;
            }
            
          }
        }
      ]
    });

    await alerta.present();
  }
  //Subir imagen a FirebaseStorage
  //Actualizacion de imagen dentro de Firebase database y user
  updateImage(){
    this.authF.authState.subscribe(auth=>{
      this.db.collection('users').doc(auth.uid).update({urlimage: this.image
        }).then(()=>{
          this.auth.isAuth().subscribe(user =>{
            if(user){
              user.updateProfile({
                photoURL: this.image
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

  async addPhoto(source: string) {

    switch (source) {
      case 'camera': {
      
        const cameraPhoto = await this.openCamera();
        this.image = cameraPhoto;
      

        const fileURI = this.image;
        let file: string;

        if (this.platform.is('ios')) {
          file = fileURI.split('/').pop();
        } else {
          file = fileURI.substring(fileURI.lastIndexOf('/') + 1);
      
        }
        const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));

     

        const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
        const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });
        const id = this.usersR[0].uid;
       
        this.imagePath = `Perfiles/profile_${id}` + '.jpg';

        const ref = this.storage.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.urlImage = ref.getDownloadURL())
        ).subscribe();
        task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
       
          const downloadURL = ref.getDownloadURL();
          downloadURL.subscribe(url=>{
            if(url){
              
              this.image = url;
              this.updateImage();
            }
          });
        })

        break;
      }
      case 'library': {
     
        const libraryImage = await this.openLibrary();
        this.image = libraryImage;
       

        const fileURI = this.image;
        let file: string;

        if (this.platform.is('ios')) {
          file = fileURI.split('/').pop();
        } else {
          file = fileURI.substring(fileURI.lastIndexOf('/') + 1, fileURI.indexOf('?'));
         
        }

        const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));

  

        const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
        const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });

        const id = this.usersR[0].uid;
      
        this.imagePath = `Perfiles/profile_${id}` + '.jpg';

        const ref = this.storage.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.urlImage = ref.getDownloadURL())
        ).subscribe();
        task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
        
          const downloadURL = ref.getDownloadURL();
          downloadURL.subscribe(url=>{
            if(url){
           
              this.image = url;
              this.updateImage();
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
            
            this.addPhoto('camera');
          }
        },
        {
          text: 'Galeria',
          handler: () => {
       
            this.addPhoto('library');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }
      ]
    });

    await alert.present();
  }


}
