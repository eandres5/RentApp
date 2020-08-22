import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo.service';
import { TaskI } from 'src/app/models/task.interface';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { finalize } from 'rxjs/operators';
import { Platform, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-articuloeditar',
  templateUrl: './articuloeditar.page.html',
  styleUrls: ['./articuloeditar.page.scss'],
})
export class ArticuloeditarPage implements OnInit {

  imagePath: string;
  upload: any;
  captureDataUrl: string;
  habilitar: Boolean;

  //variables utilizadas en la imgen
  uploadPercent: Observable<number>;
  downloadUrl: Observable<string>;
  image: string;


  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
  };

  constructor(private activatedRoute: ActivatedRoute, 
    private articuloService: ArticuloService, 
    private router: Router,
    public afSG: AngularFireStorage,
    private camera: Camera,
    private platform: Platform,
    private file: File,
    public toastController: ToastController,
    public alertController: AlertController
    ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData =>{
        this.articulo = articuloData;
      });
    }
  }

  async eliminarArticulo(id: string){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Guardar Cambios',
      message: '¿Esta seguro de guardar los cambios de este artículo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.guardarcambios();
          }
        }
      ]
    });

    await alert.present();
    
  }

  //funcion para guardar los cambios
  guardarcambios(){
    this.confirmacionArticuloEditar();
    console.log("si se guardo ajjaaj");

  }
  //metodo para tomar foto o subir desde galeria
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

        const id = Math.random().toString(36).substring(2);
        this.imagePath = `Articulos/articulo_${id}` + '.jpg';

        const ref = this.afSG.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.downloadUrl = ref.getDownloadURL())
        ).subscribe();
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

        const id = Math.random().toString(36).substring(2);
        this.imagePath = `Articulos/articulo_${id}` + '.jpg';

        const ref = this.afSG.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.downloadUrl = ref.getDownloadURL())
        ).subscribe();
        break;
      }
    }
  }
  
  //funciones para abrir galeria
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

  //funcion para abrir la camara
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

  //alerta de mensajes
  async confirmacionArticuloEditar(){
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'Cambios guardados con exito!',
      duration: 3000
    });
    toast.present();
  }
}
