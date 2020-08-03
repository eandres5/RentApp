import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Photo } from 'src/app/models/foto.interface';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-nuevoarticulo',
  templateUrl: './nuevoarticulo.page.html',
  styleUrls: ['./nuevoarticulo.page.scss'],
})
export class NuevoarticuloPage implements OnInit {

  imagePath: string;
  upload: any;
  captureDataUrl: string;

  private fotos: Photo[] = [];

  //variables utilizadas en la imgen
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  image: string;

  darkMode: boolean = true;
  articulo: TaskI = {
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
  };
  articuloId = null;

  constructor(private router: Router,
    private popoverctrl: PopoverController,
    private articuloService: ArticuloService,
    public afSG: AngularFireStorage,
    private camera: Camera,
    private webview: WebView

  ) { }

  ngOnInit() {
    this.articulo = {
      titulo: '',
      descripcion: '',
      img: '',
      telefono: '',
      costo: '',
      userId: '',
    };
    this.image = 'https://www.kasterencultuur.nl/editor/placeholder.jpg';
  }

  //se crea un nuevo articulo en la base de datos con todos los campos de la interfaz
  addArticulo() {
    this.articuloService.addArticulo(this.articulo).then(() => {
      this.router.navigate(['/home/nuevoarticulo']);
    }, err => {
    });
    this.articulo = {
      titulo: '',
      descripcion: '',
      img: '',
      telefono: '',
      costo: '',
      userId: '',
    };
  }

  //tienes que aumentar booleanos para los botones note olvides
  //y tambien poner un boton de subir imagen

  async addPhoto(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.openCamera().then((ImageData)=>{
        this.image = this.webview.convertFileSrc(ImageData);
        console.log(this.image);
      });
    } else {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.image = libraryImage;
      console.log(this.image);
    }

    //const libraryImage = await this.openLibrary();
    //this.image = 'data:image/jpg;base64,' + libraryImage;
    //console.log(this.image);

    //descomenta
    //const id = Math.random().toString(36).substring(2);
    //this.imagePath =  `Articulos/articulo_${id}` + '.jpg';

    //const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(this.imagePath, this.file);
    //this.upload = this.afSG.ref(this.imagePath).putString(this.image, 'data_url');
    //this.uploadPercent = this.upload.percentageChanges();



    //this.upload.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();


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

  //en este metodo se importo webview
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.camera.getPicture(options)
      .then((ImageData) => {
        this.image = this.webview.convertFileSrc(ImageData);
        console.log(this.image);
      });
  }

  //boton para cancelar todo
  cancelar(){
    this.articulo = {
      titulo: '',
      descripcion: '',
      img: '',
      telefono: '',
      costo: '',
      userId: '',
    };
    this.image = 'https://www.kasterencultuur.nl/editor/placeholder.jpg';
  }


  /*programacion barra arriba popover y btn salir btn dark mode*/
  async mostrarpop(evento) {

    const popover = await this.popoverctrl.create({
      component: MorebtnComponent,
      event: evento,
      translucent: true,
      mode: 'ios'
    });

    return await popover.present();
  }

  cerrarSesion() {
    this.router.navigate(['']);
    this.popoverctrl.dismiss();
  }

  modoOscuro() {
    this.darkMode = this.darkMode;
    document.body.classList.toggle('dark');
  }
}
