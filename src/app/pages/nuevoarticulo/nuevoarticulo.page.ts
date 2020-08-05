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
import { File } from '@ionic-native/file/ngx';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-nuevoarticulo',
  templateUrl: './nuevoarticulo.page.html',
  styleUrls: ['./nuevoarticulo.page.scss'],
})
export class NuevoarticuloPage implements OnInit {

  imagePath: string;
  upload: any;
  captureDataUrl: string;
  habilitar: Boolean;

  private fotos: Photo[] = [];

  //variables utilizadas en la imgen
  uploadPercent: Observable<number>;
  downloadUrl: Observable<string>;
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
    private platform: Platform,
    private file: File

  ) {
    this.habilitar = false;
  }

  ngOnInit() {
    this.articulo = {
      titulo: '',
      descripcion: '',
      img: '',
      telefono: '',
      costo: '',
      userId: '',
    };
    this.habilitar = false;
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

  //boton para cancelar todo
  cancelar() {
    this.articulo = {
      titulo: '',
      descripcion: '',
      img: '',
      telefono: '',
      costo: '',
      userId: '',
    };
    this.articulo.img = 'https://www.kasterencultuur.nl/editor/placeholder.jpg';
    this.habilitar = false;
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
