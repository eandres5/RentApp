import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
interface user{
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
  public usersR : any =[];
  public image: string;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  constructor(private router: Router, private auth: AuthService,public alertController: AlertController,private storage: AngularFireStorage, private db: AngularFirestore, private authF: AngularFireAuth) { }

  ngOnInit() {
    //inicia datos usuario
    this.datosUsuario();
  }
  //funcion para obtener datos usuario
  datosUsuario(){
    this.auth.isAuth().subscribe(us=>{
     this.auth.obtenernombreUsuario(us.uid).subscribe(usa=>{
       const data2 : user = usa.payload.data() as user;
       this.usersR[0]=data2;
       console.log(this.usersR);
     });
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
          this.updateImage();
        }
      });
    })
  })
 
  }
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

}
