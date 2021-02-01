import { Component, OnInit } from '@angular/core';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { MensajeComentarioI } from 'src/app/models/mensajeComentario.interface';
import { AuthService } from 'src/app/services/auth.service';


interface user {
  uid: string,
  nombre: string,
  apellido: string,
  celular: string,
  correo: string,
  img: string
}


@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.page.html',
  styleUrls: ['./comentario.page.scss'],
})
export class ComentarioPage implements OnInit {

  comentarioUsuario: string;
  calificacionUsuario: number;
  usuarioActivo: string;
  idUsuarioBorrar: string;
  idComenPropie: string;

  public usersR: any = [];

  idu: string;

  mensajeComentario: MensajeComentarioI = {
    content: ''
  }
  comentarioTs: ComentarioI = {
    id: '',
    idPropietarioComen: '',
    usuarios: {
      idUsuarioRenta: ''
    },
    nombre: '',
    apellido: '',
  };

  get comentarioa() {
    return this.comentarioForm.get('comentarioa');
  }

  get calificaciona() {
    return this.comentarioForm.get('calificaciona');
  }

  public errorMessages = {
    comentarioa: [
      { type: 'required', message: '*' },
      { type: 'pattern', message: 'Debe ingresar el comentario' }
    ],
    calificaciona: [
      { type: 'required', message: '*' },
      { type: 'pattern', message: 'Debe ingresar una calificaion' }
    ],
  }

  comentarioForm = this.formBuilder.group({
    comentarioa: ['', [Validators.required, Validators.minLength(5)]],
    calificaciona: ['', [Validators.required, Validators.maxLength(1)]]
  });

  constructor(private comentarioservice: ComentarioserviceService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private router: Router,
    private auth: AuthService,
    public navCtrl: NavController, 
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.datosUsuario();
    this.auth.isAuth().subscribe(user => {
      if (user) {
        this.idu = user.uid;
      }
    });
  }


  datosUsuario() {
    this.usersR = [];
    this.auth.isAuth().subscribe(us => {
      if (us) {
        this.auth.obtenernombreUsuario(us.uid).subscribe(usa => {
          const data2: user = usa.payload.data() as user;
          this.usersR[0] = data2;
          console.log(this.usersR[0].uid);
          this.usersR[0].uid = this.usuarioActivo;
        });
      }
    }
    )
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const idUsuario = this.activatedRoute.snapshot.paramMap.get('idUsuario');
    const idComenPropietario = this.activatedRoute.snapshot.paramMap.get('idComenPropie');
    this.idUsuarioBorrar = idUsuario;
    this.idComenPropie = idComenPropietario;

    if (id) {
      this.comentarioservice.getComentario(id).subscribe(comentarioData => {
        this.comentarioTs = comentarioData;        
      });
    }
  }

  async enviarComentario() {

    this.calificacionUsuario = this.comentarioForm.value['calificaciona'];

    if (this.calificacionUsuario < 0 || this.calificacionUsuario > 5) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Calificación',
        message: 'Debe ingresar una calificación entre 1 y 5',
        buttons: [
          {
            text: 'Entendido',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.comentarioUsuario = this.comentarioForm.value['comentarioa'];
      this.calificacionUsuario = this.comentarioForm.value['calificaciona'];   
      this.mensajeComentario.content = this.comentarioUsuario;
      console.log(this.idu);
      console.log(this.comentarioTs.id);
      this.comentarioservice.guadarComentario(this.mensajeComentario, this.comentarioTs.id);
      this.comentarioservice.guadarCalificacion(this.calificacionUsuario, this.comentarioTs.id);
      this.comentarioservice.deleteUsers(this.idu,this.comentarioTs.id);
      this.comentarioForm.reset();
      this.navCtrl.navigateRoot('/home/rentados');
      
    }
  }

  valor(valor) {
    console.log(valor);
  }

  directToNewPage() {
    this.navCtrl.navigateRoot('/home/rentados');
  }

}