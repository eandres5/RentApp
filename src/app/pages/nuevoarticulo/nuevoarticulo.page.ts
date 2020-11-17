import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Photo } from 'src/app/models/foto.interface';
import { File } from '@ionic-native/file/ngx';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

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
  public idu: string;
  public foto: string;

  private fotos: Photo[] = [];

  //variables utilizadas en la imgen
  uploadPercent: Observable<number>;
  downloadUrl: Observable<string>;
  image: string;

  darkMode: boolean = true;

  public titulo: string;
  public descripcion: string;
  public img: string;
  public telefono: number;
  public costo: number;
  public userId: string;
  public fechaAr: any;

  articulo: TaskI = {
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
    disponible: true,
    fecha: '',
  };
  articuloId = null;

  //variables para el form de articulo

  get tituloa(){
    return this.articuloForm.get('tituloa');
  }

  get descripciona(){
    return this.articuloForm.get('descripciona');
  }

  get descrtelefonoaipciona(){
    return this.articuloForm.get('telefonoa');
  }

  get costoa(){
    return this.articuloForm.get('telefonoa');
  }

  public errorMessages = {
    tituloa: [
      { type: 'required', message: '*' },
      { type: 'pattern', message: 'Debe ingresar el titulo del articulo' }
    ],
    descripciona:[
      { type: 'required', message: '*' },
      { type: 'pattern', message: 'Ingrese una descripción para el articulo' }
    ],
    telefonoa:[
      {type: 'pattern', message: 'Número incorrecto, por favor verifique el número'}
    ],
    costoa:[
      { type: 'pattern', message: 'Debe ingresar el costo del articulo' }
    ]

  }

  articuloForm = this.formBuilder.group({
    tituloa: ['', [Validators.required, Validators.minLength(2)]],
    descripciona: ['', [Validators.required, Validators.minLength(2)]],
    telefonoa: ['', Validators.pattern("^((\\+593-?)|0)?[0-9]{9}$")],
    costoa: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(private router: Router,
    private popoverctrl: PopoverController,
    private articuloService: ArticuloService,
    public afSG: AngularFireStorage,
    private camera: Camera,
    private platform: Platform,
    private file: File,
    private auth: AuthService,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    public toastController: ToastController,

  ) {

  }

  ngOnInit() {
    this.auth.isAuth().subscribe(user => {
      if(user){
        this.idu = user.uid;
      this.articulo.userId = this.idu;
      }
    });

    this.fechaAr = new Date();

    this.articulo = {
      titulo: '',
      descripcion: '',
      img: '',
      telefono: '',
      costo: '',
      userId: '',
      disponible: true,
      fecha: this.fechaAr
    };
    this.foto = "assets/images/camera.png";
    this.habilitar = false;
  }

  //se crea un nuevo articulo en la base de datos con todos los campos de la interfaz
  nuevo() {

    this.articulo.titulo = this.articuloForm.value['tituloa'];
    this.articulo.descripcion = this.articuloForm.value['descripciona'];
    this.articulo.telefono = '0' + this.articuloForm.value['telefonoa'];
    this.articulo.costo = this.articuloForm.value['costoa'];
    this.articulo.img = this.image;
    
    console.log(this.articulo); 
    
    this.articuloService.addArticulo(this.articulo).then(() => {
      this.router.navigate(['/home/nuevoarticulo']);
      this.confirmacionArticulo();
      this.cancelar();
    }, err => {
    });
    
    
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

        const id = Math.random().toString(36).substring(2);
        this.imagePath = `Articulos/articulo_${id}` + '.jpg';

        const ref = this.afSG.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.downloadUrl = ref.getDownloadURL())
        ).subscribe();

        task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
          console.log("Imagen subida");
          const downloadURL = ref.getDownloadURL();
          downloadURL.subscribe(url=>{
            if(url){
         
              this.image = url;
              this.foto=this.image;
            }
          });
        });

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

        task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
          console.log("Imagen subida");
          const downloadURL = ref.getDownloadURL();
          downloadURL.subscribe(url=>{
            if(url){
              
              this.image = url;
              this.foto=this.image;
            }
          });
        });

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
          text: 'Cancelar',
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

  //alerta de mensajes
  async confirmacionArticulo(){
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'Artículo creado con exito!',
      duration: 3000
    });
    toast.present();
  }

  //boton para cancelar todo
  cancelar() {

    this.articuloForm.reset();
    this.foto = "assets/images/camera.png";
    //this.articulo.img = "assets/images/camera.png";
    //this.habilitar = false;
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
  idUser() {

  }
}
