import { Component, OnInit } from '@angular/core';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.page.html',
  styleUrls: ['./comentario.page.scss'],
})
export class ComentarioPage implements OnInit {

  comentarioUsuario: string;
  calificacionUsuario: number;
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
    private router: Router ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
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
        header: 'Eliminar',
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
      console.log(this.comentarioUsuario);
      console.log(this.comentarioTs.id);
      this.comentarioservice.guadarComentario(this.comentarioUsuario, this.comentarioTs.id);
      this.comentarioservice.guadarCalificacion(this.calificacionUsuario, this.comentarioTs.id);
      this.comentarioForm.reset();
      this.router.navigate(['']);
    }

  }

  valor(valor) {
    console.log(valor);
  }

}