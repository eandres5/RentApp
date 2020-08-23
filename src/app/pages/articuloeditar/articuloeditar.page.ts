import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo.service';
import { TaskI } from 'src/app/models/task.interface';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, Validators } from '@angular/forms';
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
  public foto: string;
  public imgtemporal: string;


  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
  };

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

  constructor(private activatedRoute: ActivatedRoute, 
    private articuloService: ArticuloService, 
    private router: Router,
    public afSG: AngularFireStorage,
    private camera: Camera,
    private platform: Platform,
    private file: File,
    public toastController: ToastController,
    public alertController: AlertController,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.articulo.img = this.foto;
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData =>{
        this.articulo = articuloData;
      });
    }
  }

  //alertas
  async guardarArticulo(id : string){

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
           
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.guardarcambios(id);
          }
        }
      ]
    });

    await alert.present();
    
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
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          
          }
        }
      ]
    });

    await alert.present();
  }

  //funcion para guardar los cambios
  guardarcambios(id: string){

    this.imgtemporal = this.articulo.img;

    if (this.imgtemporal === this.foto){
      
      console.log("poner la imagen temporal");
      console.log(this.foto);

    }else{

      console.log("poner la nueva foto");
      console.log(this.imgtemporal);
    }

    ///this.articulo.titulo = this.articuloForm.value['tituloa'];
    //this.articulo.descripcion = this.articuloForm.value['descripciona'];
    //this.articulo.telefono = this.articuloForm.value['telefonoa'];
    //this.articulo.costo = this.articuloForm.value['costoa'];

    console.log(this.articulo);
    this.confirmacionArticuloEditar();
    console.log("si se guardo ajjaaj");
    //this.router.navigate(['/home/detallearticulo']);

  }
  //metodo para tomar foto o subir desde galeria
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

        const id = Math.random().toString(36).substring(2);
        this.imagePath = `Articulos/articulo_${id}` + '.jpg';

        const ref = this.afSG.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.downloadUrl = ref.getDownloadURL())
        ).subscribe();

        task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
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

        const id = Math.random().toString(36).substring(2);
        this.imagePath = `Articulos/articulo_${id}` + '.jpg';

        const ref = this.afSG.ref(this.imagePath);
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => this.downloadUrl = ref.getDownloadURL())
        ).subscribe();

        task.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
       
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
